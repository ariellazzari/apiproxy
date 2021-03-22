const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimitMiddleware = require('./rateLimitMiddleware')

const app = express();
const PORT = 3000;
const HOST = "0.0.0.0";
const API_SERVICE_URL = "http://localhost:5000";

//aplicamos a todas las requests el middleware de rate limiting
app.use('', rateLimitMiddleware)

//todas las requests que pasen el rate limiting son redireccionadas por http-proxy-middleware
app.use('/', createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
 }));

app.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
  