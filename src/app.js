const express = require("express");
const connectDB = require('./config/database')
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt")
const app = express();
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json())
app.use(cookieParser())

app.post("/signup", async (req, res) => {
  try {
    // validate signup data
    validateSignUpData(req);

    const { firstName, lastName, emailId, gender, age, password } = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    // creating a new instance of User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      gender,
      age
    })

    await user.save();
    res.send("user added successfully!")
  }
  catch (err) {
    res.status(400).send("Error saving user: " + err.message)
  }
})

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId })
    if (!user) {
      throw new Error("Invalid credentials")
    }

    const isPasswordValid = await user.validatePassword(password)

    if (isPasswordValid) {
      const token = await user.getJWT()

      res.cookie('token', token, {
        expires : new Date(Date.now() + 5 * 3600000) // expires in 5 hours
      })
      res.send("Login Successful!!")
    } else {
      throw new Error("Invalid credentials")
    }
  }
  catch (err) {
    res.status(400).send("ERROR: " + err.message)
  }
})

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user)
  }
  catch (err) {
    res.status(400).send("ERROR: " + err.message)
  }
})

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
