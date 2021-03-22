//Servidor proxy al que apunta apiproxy, devuelve un texto al recibir una request GET a '/hola'

const express = require('express');
const app = express();

const PORT = 5000;
const HOST = "0.0.0.0";

app.get('/hola', (req, res, next) => {
    console.log('request de:',req.socket.remoteAddress)
    res.send('Soy la app destino');
 });

app.listen(PORT, HOST, () => {
    console.log(`Servidor esperando conexiones del proxy ${HOST}:${PORT}`);
});