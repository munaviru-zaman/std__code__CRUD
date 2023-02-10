const express = require("express");
require("dotenv").config();
//make express server
const app = express();
app.use(express.json());

// cors
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:4200",
  })
);

// mongoose
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB, {
  useNewUrlParser: true,
});

// routes
const userRoutes = require("./routes/user");
app.use("/user", userRoutes);

// port
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on port at ${port}...`);
});
