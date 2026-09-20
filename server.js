const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const url = require('url');

const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const PRIVATE_DIR = path.join(ROOT, 'private');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');

const MAX_BODY = 64 * 1024;
const METHODS = new Set(['Cash', 'GCash', 'Maya', 'PayPal', 'Landbank • Debit / Digital ATM']);
const ALLOWED_MMRS = new Set(['none', 'ph', 'global']);
const ALLOWED_RANKS = new Set(['Grandmaster', 'Epic', 'Legend', 'Mythic', 'Mythical Honor', 'Mythical Glory', 'Mythical Immortal']);
const PUBLIC_EXTENSIONS = new Set(['.html', '.js', '.css', '.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico', '.woff', '.woff2']);

// Minimal .env loader so this project stays dependency-free. Server environment variables win.
function loadDotEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx < 1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    if (!(key in process.env)) process.env[key] = value;
  }
}
loadDotEnv(path.join(ROOT, '.env'));
const PORT = Number(process.env.PORT || 3000);
const ACTIVE_ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';

function ensureStore(file) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(file)) fs.writeFileSync(file, '[]\n', 'utf8');
}
ensureStore(ORDERS_FILE);
ensureStore(CONTACTS_FILE);

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (_) { return []; }
}
function writeJson(file, data) {
  const temp = file + '.tmp';
  fs.writeFileSync(temp, JSON.stringify(data, null, 2) + '\n', 'utf8');
  fs.renameSync(temp, file);
}
function cleanString(value, max = 300) {
  return String(value ?? '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, max);
}
function json(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, max-age=0',
    'X-Content-Type-Options': 'nosniff',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
}
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', chunk => {
      size += chunk.length;
      if (size > MAX_BODY) { reject(new Error('Request too large')); req.destroy(); return; }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); }
      catch (_) { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}
function randomId() {
  return 'EJ-' + crypto.randomBytes(12).toString('hex').toUpperCase();
}
function authOk(req) {
  if (!ACTIVE_ADMIN_TOKEN) return false;
  const raw = req.headers.authorization || '';
  const token = raw.startsWith('Bearer ') ? raw.slice(7) : '';
  const a = Buffer.from(token);
  const b = Buffer.from(ACTIVE_ADMIN_TOKEN);
  return a.length === b.length && a.length > 0 && crypto.timingSafeEqual(a, b);
}
function requireAdmin(req, res) {
  if (!authOk(req)) { json(res, 401, { error: 'Admin authentication required.' }); return false; }
  return true;
}
function paymentDetails(method, orderId = "") {
  switch (method) {
    case 'GCash': return {
      accountName: cleanString(process.env.GCASH_ACCOUNT_NAME, 120),
      accountNumber: cleanString(process.env.GCASH_ACCOUNT_NUMBER, 120),
      qrUrl: orderId ? `/api/payment-qr/${encodeURIComponent(orderId)}` : ''
    };
    case 'Maya': return {
      accountName: cleanString(process.env.MAYA_ACCOUNT_NAME, 120),
      accountNumber: cleanString(process.env.MAYA_ACCOUNT_NUMBER, 120),
      qrUrl: orderId ? `/api/payment-qr/${encodeURIComponent(orderId)}` : ''
    };
    case 'PayPal': return {
      accountName: cleanString(process.env.PAYPAL_ACCOUNT_NAME, 120),
      email: cleanString(process.env.PAYPAL_EMAIL, 160),
      qrUrl: orderId ? `/api/payment-qr/${encodeURIComponent(orderId)}` : ''
    };
    case 'Landbank • Debit / Digital ATM': return {
      accountName: cleanString(process.env.LANDBANK_ACCOUNT_NAME, 120),
      accountNumber: cleanString(process.env.LANDBANK_ACCOUNT_NUMBER, 120),
      cardType: cleanString(process.env.LANDBANK_CARD_TYPE || 'Debit / Digital ATM', 120),
      qrUrl: orderId ? `/api/payment-qr/${encodeURIComponent(orderId)}` : ''
    };
    case 'Cash': return { message: cleanString(process.env.CASH_INSTRUCTIONS || '', 500) };
    default: return null;
  }
}
function publicOrder(order) {
  const result = {
    orderId: order.orderId,
    status: order.status,
    paymentMethod: order.paymentMethod,
    createdAt: order.createdAt,
    approvedAt: order.approvedAt || null
  };
  if (order.status === 'approved') result.paymentDetails = paymentDetails(order.paymentMethod, order.orderId);
  return result;
}
function adminOrder(order) {
  return { ...order, privatePaymentConfigured: Boolean(paymentDetails(order.paymentMethod)) };
}
function safeStaticPath(requestPath) {
  let pathname = decodeURIComponent(requestPath.split('?')[0]);
  if (pathname === '/') pathname = '/index.html';
  if (pathname.startsWith('/api/') || pathname.startsWith('/private/') || pathname.startsWith('/data/')) return null;
  const resolved = path.resolve(ROOT, '.' + pathname);
  if (!resolved.startsWith(ROOT + path.sep)) return null;
  const ext = path.extname(resolved).toLowerCase();
  const base = path.basename(resolved);
  if (base.startsWith('.') || ['server.js', 'package.json'].includes(base)) return null;
  if (!PUBLIC_EXTENSIONS.has(ext) || !fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) return null;
  return resolved;
}
function serveFile(req, res, file) {
  const mime = {
    '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8',
    '.json':'application/json; charset=utf-8', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg',
    '.webp':'image/webp', '.svg':'image/svg+xml', '.ico':'image/x-icon', '.woff':'font/woff', '.woff2':'font/woff2'
  }[path.extname(file).toLowerCase()] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': mime, 'X-Content-Type-Options': 'nosniff' });
  fs.createReadStream(file).pipe(res);
}

async function handle(req, res) {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;
  try {
    if (pathname === '/api/health' && req.method === 'GET') return json(res, 200, { ok: true });

    if (pathname === '/api/orders' && req.method === 'POST') {
      const b = await parseBody(req);
      if (!cleanString(b.customerName, 60) || !cleanString(b.mlId, 30) || !cleanString(b.serverId, 10)) return json(res, 400, { error: 'Name, MLBB Account ID, and Server ID are required.' });
      if (!ALLOWED_RANKS.has(cleanString(b.currentRank, 40)) || !ALLOWED_RANKS.has(cleanString(b.targetRank, 40))) return json(res, 400, { error: 'Unsupported rank.' });
      if (!ALLOWED_MMRS.has(cleanString(b.mmrServer, 20))) return json(res, 400, { error: 'Unsupported MMR option.' });
      if (!METHODS.has(cleanString(b.paymentMethod, 100))) return json(res, 400, { error: 'Unsupported payment method.' });
      const order = {
        orderId: randomId(), createdAt: new Date().toISOString(), status: 'pending', approvedAt: null,
        customerName: cleanString(b.customerName, 60), mlId: cleanString(b.mlId, 30), serverId: cleanString(b.serverId, 10),
        currentRank: cleanString(b.currentRank, 40), targetRank: cleanString(b.targetRank, 40),
        starsNeeded: Number.isFinite(Number(b.starsNeeded)) ? Number(b.starsNeeded) : null,
        mmrServer: cleanString(b.mmrServer, 20), mmrTopTarget: b.mmrTopTarget == null ? null : Math.min(99, Math.max(1, Number(b.mmrTopTarget))),
        preferredHero: cleanString(b.preferredHero, 100), preferredRole: cleanString(b.preferredRole, 40),
        schedule: cleanString(b.schedule, 80), paymentMethod: cleanString(b.paymentMethod, 100),
        estimate: cleanString(b.estimate, 40), ratePerStar: Number.isFinite(Number(b.ratePerStar)) ? Number(b.ratePerStar) : null
      };
      const orders = readJson(ORDERS_FILE); orders.push(order); writeJson(ORDERS_FILE, orders);
      return json(res, 201, { orderId: order.orderId, status: order.status });
    }

    const match = pathname.match(/^\/api\/orders\/([^/]+)$/);
    if (match && req.method === 'GET') {
      const order = readJson(ORDERS_FILE).find(o => o.orderId === match[1]);
      if (!order) return json(res, 404, { error: 'Order not found.' });
      return json(res, 200, publicOrder(order));
    }

    const qrMatch = pathname.match(/^\/api\/payment-qr\/([^/]+)$/);
    if (qrMatch && req.method === 'GET') {
      const order = readJson(ORDERS_FILE).find(o => o.orderId === qrMatch[1]);
      if (!order || order.status !== 'approved') return json(res, 403, { error: 'Payment QR is locked until admin approval.' });
      const envKey = order.paymentMethod === 'GCash' ? 'GCASH_QR_FILE' : order.paymentMethod === 'Maya' ? 'MAYA_QR_FILE' : order.paymentMethod === 'PayPal' ? 'PAYPAL_QR_FILE' : order.paymentMethod === 'Landbank • Debit / Digital ATM' ? 'LANDBANK_QR_FILE' : '';
      if (!envKey) return json(res, 404, { error: 'No QR is used for this payment method.' });
      const rel = cleanString(process.env[envKey] || '', 300);
      const file = path.resolve(ROOT, rel);
      if (!rel || !file.startsWith(PRIVATE_DIR + path.sep) || !fs.existsSync(file)) return json(res, 404, { error: 'QR is not configured.' });
      res.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': 'no-store, max-age=0', 'X-Content-Type-Options':'nosniff' });
      fs.createReadStream(file).pipe(res);
      return;
    }

    if (pathname === '/api/contact' && req.method === 'POST') {
      const b = await parseBody(req);
      const name = cleanString(b.name, 60), email = cleanString(b.email, 160), topic = cleanString(b.topic, 80), message = cleanString(b.message, 2000);
      if (!name || !message) return json(res, 400, { error: 'Name and message are required.' });
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(res, 400, { error: 'Invalid email address.' });
      const contacts = readJson(CONTACTS_FILE); const contactId = randomId();
      contacts.push({ contactId, createdAt: new Date().toISOString(), name, email, topic, message });
      writeJson(CONTACTS_FILE, contacts);
      return json(res, 201, { contactId });
    }

    if (pathname === '/api/admin/orders' && req.method === 'GET') {
      if (!requireAdmin(req, res)) return;
      return json(res, 200, readJson(ORDERS_FILE).slice().reverse().map(adminOrder));
    }

    const approveMatch = pathname.match(/^\/api\/admin\/orders\/([^/]+)\/approve$/);
    if (approveMatch && req.method === 'POST') {
      if (!requireAdmin(req, res)) return;
      const orders = readJson(ORDERS_FILE); const i = orders.findIndex(o => o.orderId === approveMatch[1]);
      if (i < 0) return json(res, 404, { error: 'Order not found.' });
      orders[i].status = 'approved'; orders[i].approvedAt = new Date().toISOString(); writeJson(ORDERS_FILE, orders);
      return json(res, 200, { ok: true, orderId: orders[i].orderId, status: orders[i].status });
    }

    if (pathname === '/api/admin/orders' && req.method === 'DELETE') {
      if (!requireAdmin(req, res)) return;
      const id = cleanString(parsed.query.id, 32); const orders = readJson(ORDERS_FILE); const kept = orders.filter(o => o.orderId !== id);
      if (kept.length === orders.length) return json(res, 404, { error: 'Order not found.' });
      writeJson(ORDERS_FILE, kept); return json(res, 200, { ok: true });
    }

    if (pathname === '/api/admin/contacts' && req.method === 'GET') {
      if (!requireAdmin(req, res)) return;
      return json(res, 200, readJson(CONTACTS_FILE).slice().reverse());
    }

    const staticFile = safeStaticPath(req.url);
    if (staticFile && req.method === 'GET') return serveFile(req, res, staticFile);
    return json(res, 404, { error: 'Not found.' });
  } catch (err) {
    console.error(err.message);
    if (!res.headersSent) json(res, 500, { error: 'Server error.' });
  }
}

const server = http.createServer(handle);
server.listen(PORT, () => {
  console.log(`EJ Pilot Service listening on http://localhost:${PORT}`);
  if (!ACTIVE_ADMIN_TOKEN) console.warn('ADMIN_TOKEN is not set. Admin actions are disabled until it is configured.');
});
