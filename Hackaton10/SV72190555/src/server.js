require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const sequelize = require("./db");
const router = require("./routes/index.js");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const path = require("path");
app.use(express.static(path.join(__dirname, "..")));

app.get("/", (_req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use("/api", router);

app.use(errorHandler);

async function start() {
  try {
    await sequelize.authenticate();
    console.log("Conexion con la BD exitosa.");

    const syncMode = process.env.DB_SYNC || "alter";
    if (syncMode === "force") {
      await sequelize.sync({ force: true });
      console.warn("DB_SYNC: FORCE");
    } else if (syncMode === "alter") {
      await sequelize.sync({ alter: true });
      console.warn("DB_SYNC: ALTER");
    } else {
      await sequelize.sync();
      console.warn("DB_SYNC: NONE");
    }

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Fallo al iniciar el servidor:", err);
    process.exit(1);
  }
}

start();
