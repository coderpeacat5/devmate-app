const express = require("express")
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData, validatePassword } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt")

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user)
  }
  catch (err) {
    res.status(400).send("ERROR: " + err.message)
  }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validateEditProfileData(req);
    if (!validateEditProfileData) {
      throw new Error("Invalid request")
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]))
    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile was updated successfully!!`,
      data: loggedInUser
    }
    )
  }
  catch (err) {
    res.status(400).send("ERROR: " + err.message)
  }

})

profileRouter.patch("/profile/password", userAuth, async(req, res) => {
  try{
    const user = req.user;
    
    const {oldPassword, newPassword} = req.body;

    // Check if old password is correct
    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if(!isMatch) {
      throw new Error("Old password is incorrect")
    }

    // Validate new password
    if(!validatePassword(newPassword)) {
      throw new Error("Please enter a strong password")
    }
  
    // Update new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.send("Password changed successfully!!")

  }
  catch(err) {
    res.status(400).send("ERROR: " + err.message)
  }
})

module.exports = profileRouter; 