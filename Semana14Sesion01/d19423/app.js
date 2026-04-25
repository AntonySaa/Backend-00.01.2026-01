console.log("Inicio de la aplicacion");
require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios')

const app = express();
const PORT = 8000;

app.set("port", PORT);

const server = require('http').Server(app);

const webSocketServer = require('websocket').server;
const wsServer = new webSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
    if (origin === 'http://localhost:8000')
        return true;
    return false;
}

app.use(express.static(path.join(__dirname, './public')));

wsServer.on("request", (request) => {
    if (!originIsAllowed(request.origin)) {
        request.reject();
        console.log(`${new Date()} conexion rechazada`);
        return;
    }
    const connection = request.accept(null, request.origin);
    connection.on("message", (message) => {
        console.log(message.utf8Data);
        let objMensaje = JSON.parse(message.utf8Data);
        switch (objMensaje.message) {
            case "clima":
                console.log("entro a clima")
                config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: `https://weather-api99.p.rapidapi.com/weather?city=${objMensaje.query}`,
                    headers: {
                        'x-rapidapi-host': 'weather-api99.p.rapidapi.com',
                        'x-rapidapi-key': process.env.RAPIDKEY
                    }
                };

                axios.request(config)
                    .then((response) => {
                        console.log(response.data);
                        objMensaje.answer = response.data
                        connection.sendUTF(JSON.stringify(objMensaje))
                       // let temp = Math.round(response.data.main.temp - 273.15);
                       // res.end("Complatado = " + temp);

                    })
                    .catch((error) => {
                        console.log(error);
                    });

                break;

            default:
                objMensaje.recibido = "Server"
                connection.sendUTF(JSON.stringify(objMensaje))
                break;
        }

    })
})


server.listen(PORT, () => console.log(`servidor iniciado en el puerto ${PORT}`))