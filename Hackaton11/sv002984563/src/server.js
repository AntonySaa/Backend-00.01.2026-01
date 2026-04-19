console.log("Inicio de la aplicacion");

require("dotenv").config();


const PORT = process.env.PORT || 3000;

const app = require(`./app`);
const connetDB = require(`./config/db`);

(async()=>{
    await connetDB();
    app.listen(PORT, ()=>{console.log(`Servidor iniciado en ${PORT}`)});
})();