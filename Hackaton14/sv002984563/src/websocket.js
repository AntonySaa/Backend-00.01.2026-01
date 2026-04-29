const webSocket = require(`websocket`);
const PORT = process.env.PORT;

const wss = new webSocket.server({PORT});

console.log(`ws corriendo en ws:localhost:8000`);

wss.on(`connection`, (ws) =>{
    console.log(`Nuevo cliente conectado`);

    ws.send(`Bienvenico al servidor de webSocket`);

    ws.on(`message`, (message) => {
        console.log(`Mensaje recibido: ${message}`);

        ws.send(`Servidor recibio: ${message}`);
    });

    ws.on(`close`, ()=>{
        console.log(`Cliente desconectado`);
    });
});




