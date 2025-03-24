const express = require("express");

const app = express();


app.get("/getUserData", (req, res) => {
  try{
    // Logic of DB call and get user data

  throw new Error("mf kcxmdfygj");
  res.send("User Data Sent");
  }
  catch(err) {
    res.status(500).send("Something went wrong!")
  }
  
});

app.use("/", (err, req, res, next) => {
  // log ur error
  if(err) {
    
  }
  
})


app.listen(7777, () => {
  console.log("Server is successfully listening on port 7777...");
});
