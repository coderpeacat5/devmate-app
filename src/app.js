const express = require("express");
const connectDB = require('./config/database')
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express();

app.use(cors({
  origin : "http://localhost:5173",
  credentials : true,
}))

app.use(express.json())
app.use(cookieParser())

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/requests")
const userRouter = require("./routes/user")

app.use("/api", authRouter)
app.use("/api", profileRouter)
app.use("/api", requestRouter)
app.use("/api", userRouter)

connectDB()
  .then(() => {
    console.log("DB connected successfully!")
    app.listen(7777, () => {
      console.log("Server is successfully listening on port 7777...");
    });
  })
  .catch((err) => {
    console.log("DB cannot be connected!")
  })
