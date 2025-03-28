const mongoose = require("mongoose")
const validator = require("validator")
const { default: isURL } = require("validator/lib/isURL")

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
        trim : true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid email address: "+ value)
            }
        }
    },
    password : {
        type: String,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error("Please use atleast 1 uppercase, 1 lowercase, 1 symbol and 1 number and password should be of atleast 8 characters.")
            }
        },
    },
    age : {
        type : Number,
        min : 18,
        max : 100
    },
    gender : {
        type : String,
        validate(value) {
            if(!["male", "female","others"].includes(value)) {
                throw new Error("Not valid gender data")
            }
        }
    },
    photoUrl : {
        type: String,
        default: "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=",
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error("Not valid Photo URL: " + value)
            }
        }
    },
    about : {
        type : String,
        default : "This is a default about of user"
    },
    skills : {
        type : [String]
    }
},
{
    timestamps : true
}
)

const User = mongoose.model("User", userSchema);

module.exports = User;