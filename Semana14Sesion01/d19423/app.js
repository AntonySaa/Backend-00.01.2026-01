console.log("Inicio de la aplicacion");

const express = require('express');
const path = require('path');


const app  = express();
const PORT = 8000;

app.set("port",PORT);

const server = require('http').Server(app);

const webSocketServer = require('websocket').server;
const wsServer = new webSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin){
    if(origin==='http://localhost:8000')
        return true;
    return false;
}

app.use(express.static(path.join(__dirname,'./public')));

wsServer.on("request",(request)=>{
    if(!originIsAllowed(request.origin)){
        request.reject();
        console.log(`${new Date()} conexion rechazada`);
        return;
    }
    const connection = request.accept(null,request.origin);
    connection.on("message",(message)=>{
        console.log(message.utf8Data);
        let objMensaje = JSON.parse(message.utf8Data);
        objMensaje.recibido = "Server"
        connection.sendUTF(JSON.stringify(objMensaje))
    })
})


server.listen(PORT, ()=>console.log(`servidor iniciado en el puerto ${PORT}`))