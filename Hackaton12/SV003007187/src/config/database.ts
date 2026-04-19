import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    console.log(' Conectando a MongoDB Atlas...');
    const conn = await mongoose.connect(process.env.MONGODB_URI!);
    console.log(` MongoDB conectado: ${conn.connection.host}`);
    console.log(` Base de datos por defecto: ${conn.connection.name || 'se creará al guardar datos'}`);
  } catch (error) {
    console.error(' Error:', error);
    process.exit(1);
  }
};