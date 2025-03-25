const express = require("express");
const connectDB = require('./config/database')
const User = require("./models/user")

const app = express();

app.use(express.json())

app.post("/signup", async (req, res) => {

  // creating a new instance of User model
  const user = new User(req.body)

  try {
    await user.save();
    res.send("user added successfully!")
  } 
  catch (err) {
    res.status(400).send("Error saving user" + err.message)
  }
})

// GET user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const user = await User.findOne({emailId : userEmail})
    if(user.length === 0) {
      res.status(400).send("something went wrong!")
    } else {
      res.send(user)
    }
    
  }
  catch(err) {
    res.status(500).send("something went wrong")
  }
})

// Feed API - GET /feed - get all the users from the feed
app.get("/feed" , async (req, res) => {
  try {
    const user = await User.find({})
    if(user.length === 0) {
      res.status(400).send("something went wrong!")
    } else {
      res.send(user)
    }
  }
  catch(err) {
    res.status(500).send("something went wrong")
  }
})

app.get("/userId", async (req, res) => {
  const userId = req.body.id
  try {
    const user = await User.findById({_id : userId})
    if(!user) {
      res.status(400).send("something went wrong")
    }
    else {
      res.send(user)
    }
  }
  catch(err) {
    res.send(err.message)
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
