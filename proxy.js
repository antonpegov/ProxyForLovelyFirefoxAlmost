var https = require('https'),
    httpProxy = require('http-proxy'),
    url = require('url');

var mainnet = httpProxy.createProxyServer({
  target:'https://mainnet.infura.io',
  changeOrigin: true,
  agent  : https.globalAgent,
}).listen(3000);
var rinkeby = httpProxy.createProxyServer({
  agent  : https.globalAgent,
  changeOrigin: true,
  target:'https://rinkeby.infura.io',
}).listen(4000);

var allowedOrigins = ['timelock.bankex.com', 'timelock.staging.bankex.team', '127.0.0.1'];

rinkeby.on('proxyRes', (proxyRes, req, res) => {
  let allowedOrigin = false;
  if (req.headers.origin) {
    const originHostName = url.parse(req.headers.origin).hostname;
    if (originHostName && allowedOrigins.some(o => o === originHostName)) {
      res.setHeader('access-control-allow-origin', req.headers.origin);
      res.setHeader('access-control-allow-credentials', 'false');
      allowedOrigin = true;
    }
  }
  
  if (req.headers['access-control-request-method']) {
    res.setHeader('access-control-allow-methods', req.headers['access-control-request-method']);
  }
  
  if (req.headers['access-control-request-headers']) {
    res.setHeader('access-control-allow-headers', req.headers['access-control-request-headers']);
  }
  
  if (allowedOrigin) {
    res.setHeader('access-control-max-age', 60 * 60 * 24 * 30);
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
    }
  }
});

rinkeby.on('error', function (err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  res.end('Something went wrong.');
});

mainnet.on('proxyRes', (proxyRes, req, res) => {
  let allowedOrigin = false;
  if (req.headers.origin) {
    const originHostName = url.parse(req.headers.origin).hostname;
    if (originHostName && allowedOrigins.some(o => o === originHostName)) {
      res.setHeader('access-control-allow-origin', req.headers.origin);
      res.setHeader('access-control-allow-credentials', 'false');
      allowedOrigin = true;
    }
  }
  
  if (req.headers['access-control-request-method']) {
    res.setHeader('access-control-allow-methods', req.headers['access-control-request-method']);
  }
  
  if (req.headers['access-control-request-headers']) {
    res.setHeader('access-control-allow-headers', req.headers['access-control-request-headers']);
  }
  
  if (allowedOrigin) {
    res.setHeader('access-control-max-age', 60 * 60 * 24 * 30);
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
    }
  }
});

mainnet.on('error', function (err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  res.end('Something went wrong.');
});