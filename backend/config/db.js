import mongoose from 'mongoose';

/**
 * Connects to MongoDB Atlas / Local MongoDB instance
 */
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri || mongoUri.includes('<username>') || mongoUri.includes('<password>')) {
      console.warn('\n================================================================');
      console.warn('⚠️  MONGODB ATLAS NOT CONFIGURED YET');
      console.warn('   Please open `backend/.env` and replace <username> and <password>');
      console.warn('   with your actual MongoDB Atlas cluster credentials.');
      console.warn('================================================================\n');
    }

    const conn = await mongoose.connect(mongoUri || 'mongodb://127.0.0.1:27017/crimevision', {
      autoIndex: true,
    });

    console.log(`\x1b[32m✔ MongoDB Connected: ${conn.connection.host}\x1b[0m`);
    console.log(`\x1b[36m✔ Database: ${conn.connection.name}\x1b[0m`);
  } catch (error) {
    console.error(`\x1b[31m✖ MongoDB Connection Error: ${error.message}\x1b[0m`);
    console.error('  Tip: Verify your IP address is whitelisted in MongoDB Atlas Network Access.');
  }
};

export default connectDB;
