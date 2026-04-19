console.log("Inicio de la aplicacion");

require("dotenv").config();
const morgan = require("morgan");


const express = require(`express`);
const rateLimit = require(`express-rate-limit`);
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100
});

const app = express();
const insumoRoute = require(`./routes/route.insumo`);
const materiaPrimaRoute = require(`./routes/route.materiaPrima`);
const personalRoute = require(`./routes/route.personal`);
const produccionRoute = require(`./routes/route.produccion`);

app.use(express.json());
app.use(morgan("dev"));
app.use(limiter);

app.use(`/insumo`,insumoRoute);
app.use(`/materiaPrima`,materiaPrimaRoute);
app.use(`/personal`,personalRoute);
app.use(`/produccion`,produccionRoute);

module.exports = app;
