import "dotenv/config";
import app from "./app.js";
import connectDB from "./db.js";

await connectDB();

const port = process.env.PORT || 4000;

//Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
