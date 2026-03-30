console.log("Inicio de la aplicacion");
require("dotenv").config();

const connectDB = require('./db');

const express = require('express');
const PORT = process.env.PORT || 8080;

const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100
}
);

const morgan = require('morgan');
const errors = require('./middlewares/error.middleware');


const app = express();
app.use(express.json());

app.use(morgan("dev"));
app.use(limiter);
app.use(errors)


app.get('/', (req, res) => {
    res.send({ message: true })
})

connectDB().then(
    app.listen(PORT, () => {
        console.log(`Servidor escuchando el puerto ${PORT}`)
    })
).catch(error => {
    console.log(error)
})