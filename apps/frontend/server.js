'use strict';

const express = require('express');
const client = require('prom-client');

const PORT = process.env.PORT || 8080;
const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:3001';
const SERVICE = 'frontend';

function log(level, msg, fields = {}) {
  process.stdout.write(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      service: SERVICE,
      msg,
      ...fields,
    }) + '\n'
  );
}

const register = client.register;
client.collectDefaultMetrics({ prefix: 'frontend_' });
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de peticiones HTTP al frontend',
  labelNames: ['method', 'route', 'status'],
});

const app = express();

app.use((req, res, next) => {
  res.on('finish', () => {
    const route = req.route ? req.route.path : req.path;
    httpRequestsTotal.inc({ method: req.method, route, status: res.statusCode });
    log('INFO', 'http_request', {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
    });
  });
  next();
});

const PAGE = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>INFRA - Laboratorio de Observabilidad</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #e8f5e9; min-height: 100vh; }
    .container { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
    
    .header { background: #2e7d32; color: white; padding: 40px; border-radius: 8px; margin-bottom: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header h1 { font-size: 32px; font-weight: 700; margin-bottom: 10px; }
    .header p { font-size: 15px; opacity: 0.95; line-height: 1.6; }
    
    .card { background: white; border: 1px solid #c8e6c9; border-radius: 8px; padding: 30px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    
    .section-title { font-size: 16px; font-weight: 600; color: #1b5e20; margin-bottom: 20px; }
    
    .button-group { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 24px; }
    .btn { padding: 12px 20px; font-size: 14px; font-weight: 500; border: 1px solid #81c784; border-radius: 6px; background: #f1f8e9; color: #2e7d32; cursor: pointer; transition: all 0.2s ease; }
    .btn:hover { background: #c8e6c9; border-color: #558b2f; }
    .btn:active { transform: scale(0.98); }
    .btn.primary { background: #4caf50; color: white; border-color: #388e3c; }
    .btn.primary:hover { background: #388e3c; }
    
    .output { background: #f1f8e9; border: 1px solid #aed581; border-radius: 6px; padding: 16px; font-family: monospace; font-size: 12px; color: #33691e; min-height: 120px; max-height: 300px; overflow-y: auto; white-space: pre-wrap; word-break: break-word; }
    
    .status { display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #c8e6c9; border-radius: 6px; font-size: 13px; color: #1b5e20; margin-top: 12px; border-left: 3px solid #2e7d32; }
    
    .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-top: 20px; }
    .info-box { background: #f1f8e9; padding: 12px; border-radius: 6px; border-left: 3px solid #4caf50; }
    .info-box-label { font-size: 12px; color: #558b2f; font-weight: 600; }
    .info-box-value { font-size: 13px; color: #2e7d32; margin-top: 4px; font-family: monospace; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>INFRA</h1>
      <p>Laboratorio de Observabilidad - Prometheus, Loki y Grafana en accion</p>
    </div>
    
    <div class="card">
      <div class="section-title">Acciones</div>
      <div class="button-group">
        <button class="btn primary" onclick="saludar()">Saludar a la API</button>
        <button class="btn" onclick="cargarCPU()">Generar carga CPU (30s)</button>
        <button class="btn" onclick="limpiar()">Limpiar</button>
      </div>
      <div class="status">
        Sistema listo - Backend disponible en localhost:3001
      </div>
    </div>
    
    <div class="card">
      <div class="section-title">Respuesta del servidor</div>
      <div id="output" class="output">Listo. Haz clic en un boton para ver respuestas.</div>
    </div>
    
    <div class="card">
      <div class="section-title">URLs disponibles</div>
      <div class="info-grid">
        <div class="info-box">
          <div class="info-box-label">Frontend</div>
          <div class="info-box-value">localhost:8080</div>
        </div>
        <div class="info-box">
          <div class="info-box-label">Backend API</div>
          <div class="info-box-value">localhost:3001</div>
        </div>
        <div class="info-box">
          <div class="info-box-label">Prometheus</div>
          <div class="info-box-value">localhost:9090</div>
        </div>
        <div class="info-box">
          <div class="info-box-label">Grafana</div>
          <div class="info-box-value">localhost:3000</div>
        </div>
        <div class="info-box">
          <div class="info-box-label">Loki</div>
          <div class="info-box-value">localhost:3100</div>
        </div>
        <div class="info-box">
          <div class="info-box-label">Alloy</div>
          <div class="info-box-value">localhost:12345</div>
        </div>
      </div>
    </div>
  </div>

  <script>
    async function saludar() {
      try {
        const r = await fetch('/api/hello?name=clase');
        const data = await r.json();
        document.getElementById('output').textContent = JSON.stringify(data, null, 2);
      } catch (e) {
        document.getElementById('output').textContent = 'Error: ' + String(e);
      }
    }
    
    async function cargarCPU() {
      try {
        const r = await fetch('/api/load?seconds=30');
        const data = await r.json();
        document.getElementById('output').textContent = 
          JSON.stringify(data, null, 2) + 
          '\\n\\nObserva el panel de CPU en Grafana: deberia superar el 50%.';
      } catch (e) {
        document.getElementById('output').textContent = 'Error: ' + String(e);
      }
    }
    
    function limpiar() {
      document.getElementById('output').textContent = 'Listo. Haz clic en un boton para ver respuestas.';
    }
  </script>
</body>
</html>`;

app.get('/', (req, res) => res.type('html').send(PAGE));

app.get('/api/hello', async (req, res) => {
  try {
    const url = BACKEND_URL + '/api/hello?name=' + encodeURIComponent(req.query.name || 'mundo');
    const r = await fetch(url);
    res.status(r.status).json(await r.json());
  } catch (e) {
    log('ERROR', 'backend_no_disponible', { detail: String(e) });
    res.status(502).json({ error: 'backend no disponible' });
  }
});

app.get('/api/load', async (req, res) => {
  try {
    const url = BACKEND_URL + '/load?seconds=' + (parseInt(req.query.seconds, 10) || 30);
    const r = await fetch(url);
    log('WARN', 'carga_cpu_solicitada_desde_frontend', {});
    res.status(r.status).json(await r.json());
  } catch (e) {
    res.status(502).json({ error: 'backend no disponible' });
  }
});

app.get('/healthz', (req, res) => res.json({ status: 'ok' }));

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(PORT, () => log('INFO', 'frontend_iniciado', { port: PORT, backend: BACKEND_URL }));

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
const events = [
  () => log('INFO', 'pagina_vista', { page: '/', session: rand(1, 999) }),
  () => log('INFO', 'click_boton', { button: ['saludar', 'cargar'][rand(0, 1)] }),
  () => log('WARN', 'recurso_lento', { asset: 'main.js', load_ms: rand(900, 3000) }),
  () => log('ERROR', 'error_js_cliente', { message: 'TypeError: undefined is not a function' }),
];
setInterval(() => events[rand(0, events.length - 1)](), 5000);
