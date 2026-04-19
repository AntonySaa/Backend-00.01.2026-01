 import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import itemRoutes from './routes/itemRoutes';   

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api', itemRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API de Lista de Compras funcionando' });
});

app.listen(PORT, () => {
  console.log(` Servidor en http://localhost:${PORT}`);
});