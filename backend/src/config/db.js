import mongoose from "mongoose";


/* Probably best NOT to touch this. 

Creates connectDB function.
Try: Try to assign the MONGO_URI from the .env file (process.env is where it ended up when its loaded)
    Then create a connection with mongoose.connect(uri) (await is to just wait for it to form the connection)
If anything fails:
    Catch: returns error message instead of crashing the program


*/
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not set in .env");
    }
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

