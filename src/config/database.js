const mongoose = require("mongoose")

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://namastedev:D8CHG1wF6BaR1RFR@namastenode.mg2rr.mongodb.net/devMate"
    )
}

module.exports = connectDB;

