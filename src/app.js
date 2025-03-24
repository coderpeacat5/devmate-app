const express = require("express");

const app = express();


app.get("/getUserData", (req, res) => {
    res.send("User Data Sent");
});


app.listen(7777, () => {
  console.log("Server is successfully listening on port 7777...");
});
