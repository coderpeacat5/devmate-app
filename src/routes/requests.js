const express = require("express");
const {userAuth} = require("../middlewares/auth")

const requestRouter = express.Router();

requestRouter.post("/sendRequest", userAuth, (req, res) => {
    const user = req.user;
    res.send(user.firstName + " sent a connection request")
})

module.exports = requestRouter; 