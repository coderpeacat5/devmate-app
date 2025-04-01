const mongoose = require("mongoose")
const validator = require("validator")
const { default: isURL } = require("validator/lib/isURL")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

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
        enum : {
            values : ["male", "female","other"],
            message : `{VALUE} is not a valid gender type`
        }
        // validate(value) {
        //     if(!["male", "female","others"].includes(value)) {
        //         throw new Error("Not valid gender data")
        //     }
        // }
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

userSchema.index({firstName : 1, lastName : 1})

// Create a JWT token
userSchema.methods.getJWT = async function() {
    const user = this;
    
    const token = await jwt.sign({ _id: user._id }, "dev@Mate$2300", {
    expiresIn: "1d",
  })
  return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser)  {
    const user = this;
    const passwordHash = this.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash)

    return isPasswordValid;
}

const User = mongoose.model("User", userSchema);
module.exports = User;