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

// Pre-save middleware to set default photo based on gender
userSchema.pre('save', function (next) {
    if (!this.photoUrl) {
        if (this.gender === 'female') {
            this.photoUrl = "https://p7.hiclipart.com/preview/516/431/747/computer-icons-female-user-profile-female-girl-wife-woman-icon.jpg"
        } else {
            this.photoUrl = "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png"
        }
    }
    next();
})

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