const express = require("express");

const app = express();

// app.use("/user", (req, res) => {
//   res.send("Hehehehehee")
// })

// app.get("/user", (req, res) => {
//   res.send({"firstname" : "Gayatri", "lastname" : "Singh"})
// })

// app.post("/user", (req, res) => {
//   // saving data to db
//   res.send("Data saved to database successfully!")
// })

// app.delete("/user", (req, res) => {
//   res.send("User deleted successfully")
// })

app.listen(7777, () => {
  console.log("Server is successfully listening on port 7777...");
});
