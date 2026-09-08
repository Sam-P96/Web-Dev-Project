const express = require("express");
const morgan = require('morgan')
const app = express();

app.use(morgan('tiny'));

//ROUTERS
const userRouter = require("./routes/userRouter");

// Middleware to parse JSON
app.use(express.json());


//ROUTES
app.use("/", userRouter);

const port = 4000;

//Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


