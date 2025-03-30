const validator = require("validator")

const validateSignUpData = (req) => {
    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName) {
        throw new Error("Not valid name")
    }
    if(!validator.isEmail(emailId)) {
        throw new Error("Not valid email")
    }
    if(!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password")
    }
}

const validateEditProfileData = (req) => {
    const allowedFields = ["firstName", "lastName", "age", "photoUrl", "about", "gender", "skills"]

    const isEditAllowed = Object.keys(req.body).every((field) => allowedFields.includes(field))

    return isEditAllowed;
}

const validatePassword = (password) => {
    if(validator.isStrongPassword(password)) {
        return true;
    }
    return false
}

module.exports = {
    validateSignUpData,
    validateEditProfileData,
    validatePassword
}