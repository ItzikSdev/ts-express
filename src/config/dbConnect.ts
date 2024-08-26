import mongoose, { ConnectOptions } from "mongoose";

export const dbConnect = async () => {
  try {
    const mongoOptions: ConnectOptions = {};
    const conn = await mongoose.connect(
      process.env.MONGO_URL as string,
      mongoOptions
    );
    console.log(`[MongoDB]: mongodb connected on: ${conn.connection.host}`);
  } catch (err) {
    console.error("Failed to connect to database", err);
    process.exit(1);
  }
};
