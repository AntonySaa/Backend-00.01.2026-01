require (`dotenv`).config();
console.log("Inicio de la aplicacion");

const connectDB = require(`./config/db.js`);

connectDB();

const app = require(`./app.js`);
const http = require('http');

const clientes = [];

const Message = require(`./models/model.js`);
const server = http.createServer(app);

const webSocketServer = require(`websocket`).server;

const wsServer = new webSocketServer ({
  httpServer: server,
  autoAcceptConnections: false
});

wsServer.on("request",(request)=>  {
    if(!originIsAllowed(request.origin)){
        request.reject();
        console.log(`${new Date()} conexion rechazada`);
        return;
    }
    const connection = request.accept(null,request.origin);
    clientes.push(connection);
    connection.on("message", async (message)=>{
      if (message.type === "utf8") {
        console.log(message.utf8Data);

        const data = JSON.parse(message.utf8Data);

        try {
          const nuevoMensaje = new Message({
            user:data.user,
            text: data.text
          }); 
            await nuevoMensaje.save();
            console.log("Guardado en DB:", data);
          } catch (error) {
            console.error("Error guardando mensaje:", error);
          }

        clientes.forEach((cliente)=>{
          if (cliente.connected) {
            cliente.sendUTF(JSON.stringify(data));
          }
        });
      }
    });

    connection.on("close", ()=>{
      console.log("Cliente desconectado");

      const index = clientes.indexOf(connection);
      if (index !== -1) {
        clientes.splice(index,1);
      }
    });
})

function originIsAllowed(origin){
  if(origin=== `http://localhost:8000`)
    return true;
} 

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});

