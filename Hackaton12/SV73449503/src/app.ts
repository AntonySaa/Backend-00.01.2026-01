import express, { Request, Response } from "express";
import dotenv from "dotenv";
import itemRoutes from "./routes/itemRoutes";
import { connectDB } from "./config/db";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({ mensaje: "API Lista de Compras activa" });
});

app.use(itemRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ mensaje: "Ruta no encontrada", ruta: req.originalUrl });
});

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const start = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Servidor escuchando en puerto ${port}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar la app:", error);
    process.exit(1);
  }
};

start();
