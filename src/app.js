const express = require("express");

const app = express();

app.use("/hello/2", (req, res) => {
  res.send("Abracadabra!");
});

app.use("/hello", (req, res) => {
  res.send("Hello hello hello!");
});

app.use("/test", (req, res) => {
  res.send("Hello from the server!");
});

app.use("/", (req, res) => {
  res.send("Namaste Akshay!");
});

app.listen(7777, () => {
  console.log("Server is successfully listening on port 7777...");
});
