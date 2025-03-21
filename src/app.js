const express = require("express")

const app = express();

app.use("/" , (req, res) => {
    res.send("Namaste Developer!")
})

app.use("/hello", (req, res) => {
    res.send("hello hello hello")
})

app.use("/test", (req, res) => {
    res.send("hello from server!")
})

app.listen(3000, () => {
    console.log("server is listening on port 3000")
});