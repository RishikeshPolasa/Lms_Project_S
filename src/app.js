const express = require("express");
const path = require("path");
const app = express();
require("./db/connect");

const Register = require("./models/registers");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../views");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));
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

app.post("/register", async (req, res) => {
  if (req.body.Password === req.body.ConfirmPassword) {
    const registerStudent = new Register({
      Name: req.body.Name,
      Email: req.body.Email,
      Password: req.body.Password,
      ConfirmPassword: req.body.ConfirmPassword,
    });
    const registered = await registerStudent.save();
    res.status(201).render("index");
  } else {
    res.send("Passwords are not matching!");
  }
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.Email;
    const password = req.body.Password;
    const userEmail = await Register.findOne({ Email: email });
    const Password = userEmail.Password;
    if (password === Password) {
      res.render("index");
    } else {
      res.send("Password Incorrect");
    }
    // console.log(`${email} and ${password}`);
  } catch (err) {
    res.status(400).send("Invalid Email");
  }
});

app.listen(port, () => {
  console.log(`Server is up and running at port no ${port}`);
});
