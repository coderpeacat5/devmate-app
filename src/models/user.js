const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required : true,
        minLength: 4,
        maxLength: 20
    },
    lastName : {
        type: String
    },
    emailId : {
        type: String,
        lowercase : true,
        required : true,
        unique : true,
        trim : true
    },
    password : {
        type: String
    },
    age : {
        type : Number,
        min : 18,
        max : 100
    },
    gender : {
        type : String,
        validat(value) {
            if(!["male, female","others"].includes(value)) {
                throw new Error("Not valid gender data")
            }
        }
    },
    photoUrl : {
        type: String,
        default: "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
    },
    about : {
        type : String,
        default : "This is a default about of user"
    },
    skills : {
        type : [String]
    }
})

const User = mongoose.model("User", userSchema);

module.exports = User;