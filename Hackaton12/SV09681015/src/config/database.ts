import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopping-list';

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
