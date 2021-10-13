const express = require("express");
const path = require("path");
const app = express();
require("./db/connect");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
app.use(express.static(static_path));

// app.use(express.static(__dirname + "/public"));
// app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  // res.send("Hello from Express");
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.listen(port, () => {
  console.log(`Server is up and running at port no ${port}`);
});
