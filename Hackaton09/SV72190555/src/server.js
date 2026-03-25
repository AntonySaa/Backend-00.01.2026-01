require("dotenv").config();
const express = require("express");
const sequelize = require("./db");

const usersRouter = require("./routes/users.routes");
const coursesRouter = require("./routes/courses.routes");
const lessonsRouter = require("./routes/lessons.routes");
const enrollmentsRouter = require("./routes/enrollments.routes");
const commentsRouter = require("./routes/comments.routes");

const { errorHandler } = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 3030;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (_req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use("/api/users", usersRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/courses/:courseId/lessons", lessonsRouter);
app.use("/api/enrollments", enrollmentsRouter);
app.use("/api/lessons/:lessonId/comments", commentsRouter);

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
