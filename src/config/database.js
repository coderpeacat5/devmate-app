const mongoose = require("mongoose")

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://namastedev:bUk3qOiiUybqaIpj@namastenode.mg2rr.mongodb.net/devMate"
    )
}

module.exports = connectDB;

