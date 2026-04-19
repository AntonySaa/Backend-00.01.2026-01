require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const router = require("./routes/index.js");
const { errorHandler } = require("./middlewares/errorHandler");
const connectDB = require("./config/database.js");

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.json({
    status: "OK",
    message: "Hackaton 11 - API Fabrica de Armarios",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/", router);

app.use(errorHandler);

async function start() {
  try {
    app.listen(PORT, () => {
      console.log(`El servidor esta corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.log("Fallo al iniciar el servidor: ", err);
    process.exit(1);
  }
}

start();
