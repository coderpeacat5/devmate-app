const express = require("express");
const {userAuth} = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"]
        if(!allowedStatus.includes(status)) {
            return res.status(400).json({message : "Invalid status type : " + status })
        }

        // If there is existing collection request
        const existingConnection = await ConnectionRequestModel.findOne({
            $or : [
                {fromUserId : fromUserId , toUserId : toUserId},
                {fromUserId : toUserId , toUserId : fromUserId}
            ]
        })
        if(existingConnection) {
            return res.status("400").send("Connection request already exists!!")
        }

        const toUser = await User.findById(toUserId);
        if(!toUser) {
            return res.status(400).send("User does not exist")
        }

        const connectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status
        })

        const data = await connectionRequest.save();

        res.json({
            message : "Connection request sent successfully",
            data,
        })
    }   
    catch(err) {
        res.status(400).send("ERROR: " + err.message)
      }
})

module.exports = requestRouter; 