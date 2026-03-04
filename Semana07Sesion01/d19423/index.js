// const moment = require('moment');
// moment.locale('es');
// console.log("Inicio de la aplicacion de nodejs con nodemon a las "+moment().format("[Hoy dia es] dddd"))

const http = require('http');
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World desde mi app de node!<br> <h1>Hola</h1>');
}).listen(8000);
