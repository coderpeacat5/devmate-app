require('dotenv').config();
const express = require("express");
const connectDB = require('./config/database')
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express();

app.use(cors({
  origin : ["http://localhost:5173", "http://16.170.206.18"],
  credentials : true,
}))

app.use(express.json())
app.use(cookieParser())

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/requests")
const userRouter = require("./routes/user")

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)

connectDB()
  .then(() => {
    console.log("DB connected successfully!")
    app.listen(process.env.PORT, () => {
      console.log("Server is successfully listening on port 7777...");
    });
  })
  .catch((err) => {
    console.log("DB cannot be connected!")
  })
