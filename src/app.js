const express = require("express");
const connectDB = require('./config/database')
const User = require("./models/user")

const app = express();

app.post("/signup", async (req, res) => {
  // creating a new instance of User model
  const user = new User({
    firstName: "Toto",
    lastName: "Singh",
    emailId: "toto@mail.com",
    password: "123"
  })

  try {
    await user.save();
    res.send("user added successfully!")
  } 
  catch (err) {
    res.status(400).send("Error saving user" + err.message)
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
