const express = require("express");
const connectDB = require('./config/database')
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt")
const app = express();
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")

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

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (isPasswordValid) {
      // Create a JWT token
      const token = await jwt.sign({ _id: user._id }, "dev@Mate$2300")
      console.log(token)

      res.cookie('token', token)
      res.send("Login Successful!!")
    } else {
      throw new Error("Invalid credentials")
    }
  }
  catch (err) {
    res.status(400).send("ERROR: " + err.message)
  }
})

app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if(!token) {
      throw new Error("Invalid token")
    }

    // Validate my token
    const decodedMessage = await jwt.verify(token, "dev@Mate$2300")
    console.log(decodedMessage)
    const { _id } = decodedMessage;

    const user = await User.findById(_id)
    if(!user) {
      throw new Error("Please login again")
    }

    res.send(user)
  }
  catch (err) {
    res.status(400).send("ERROR: " + err.message)
  }
})

// GET user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const user = await User.findOne({ emailId: userEmail })
    if (user.length === 0) {
      res.status(400).send("something went wrong!")
    } else {
      res.send(user)
    }

  }
  catch (err) {
    res.status(500).send("something went wrong")
  }
})

// Feed API - GET /feed - get all the users from the feed
app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({})
    if (user.length === 0) {
      res.status(400).send("something went wrong!")
    } else {
      res.send(user)
    }
  }
  catch (err) {
    res.status(500).send("something went wrong")
  }
})

app.get("/userId", async (req, res) => {
  const userId = req.body.id
  try {
    const user = await User.findById({ _id: userId })
    if (!user) {
      res.status(400).send("something went wrong")
    }
    else {
      res.send(user)
    }
  }
  catch (err) {
    res.send(err.message)
  }
})

// Delete user from databse
app.delete("/user", async (req, res) => {
  const userId = req.body.userId

  try {
    const user = await User.findByIdAndDelete(userId)
    res.send("user deleted successfully")
  }
  catch (err) {
    res.status(500).send("Something went wrong")
  }
})

// Update data of user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ["about", "gender", "age", "skills", "photoUrl", "password"]

    const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k)
    )

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed")
    }

    if (data.skills?.length > 50) {
      throw new Error("Skills should not be more than 50")
    }

    const user = await User.findByIdAndUpdate(userId, data, { returnDocument: "before", runValidators: true })
    console.log(user)
    res.send("user updated successfully")
  }
  catch (err) {
    res.status(400).send("UPDATE FAILED : " + err.message)
  }
})

//  app.patch("/user", async (req, res) => {
//   const userEmail = req.body.userId; // Extract emailId and update fields
//   const data = req.body;
//   try {
//     const updatedUser = await User.findOneAndUpdate({ emailId: userEmail }, data);

//     if (!updatedUser) {
//       return res.status(404).send({ message: "User not found" });
//     }
//   } catch (err) {
//     res.status(500).send({ message: "Something went wrong", error: err.message });
//   }
// });

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
