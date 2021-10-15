if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const app = express();
const bcrypt = require("bcrypt");
const initializePassport = require("../src/passport-authentication/passport-config");
const passport = require("passport");
const passportLocal = require("./passport-authentication/passport-config");
const flash = require("express-flash");
const session = require("express-session");
require("./db/connect");

const Register = require("./models/registers");
const auth = require("./middleware/auth");
const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../views");

// initializePassport(passport, async (email) => {
//   const response = Register.find((user) => user.Email === email);
//   return response;
//   // console.log(email);
//   // return null;
// });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));
app.set("view engine", "ejs");
app.use(flash());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

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

app.get("/course", (req, res) => {
  // console.log(req);
  res.render("course");
});
app.get("/logout", (req, res) => {
  req.logOut();
  return res.redirect("login");
  // try {
  //   console.log(req);
  //   res.clearCookie("jwt");
  //   await req.user.save();
  //   res.render("/");
  //   // console.log("logout successful");
  // } catch (err) {
  //   res.status(500).send(err);
  // }
});

app.get("/profile", passport.checkAuthentication, async (req, res) => {
  console.log(req.user);
  const userEmail = await Register.findOne({ Email: req.user.Email });
  console.log(userEmail);
  res.render("profile", {
    name: userEmail.Name,
    image: `https://avatars.dicebear.com/api/human/${userEmail.ImageValue}.svg`,
    title: userEmail.Title,
    language: userEmail.Language,
    email: userEmail.Email,
  });
});
app.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.Password, 10);
    var val = Math.floor(Math.random() * 5000);
    if (req.body.Password === req.body.ConfirmPassword) {
      const registerStudent = new Register({
        Name: req.body.Name,
        Id: Date.now().toString(),
        Email: req.body.Email,
        Password: hashedPassword,
        ConfirmPassword: req.body.ConfirmPassword,
        Language: req.body.Language,
        Title: req.body.Title,
        ImageValue: val,
      });
      // const token = await registerStudent.generateAuthToken();
      // console.log(token);
      // // console.log(req.body);
      const registered = await registerStudent.save();
      res.render("index");
    } else {
      res.send("Passwords are not matching!");
    }
  } catch (e) {
    res.redirect("register");
    console.log(e);
  }
  // console.log(registerStudent);
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
// app.post("/login", passport.authenticate('local' => {

// try {
//   const email = req.body.Email;
//   const password = req.body.Password;
//   const userEmail = await Register.findOne({ Email: email });
//   const Password = userEmail.Password;
//   const Name = userEmail.Name;
//   if (password === Password) {
//     console.log(userEmail);
//     res.render("profile", {
//       name: Name,
//       password: Password,
//       email: email,
//       image: `https://avatars.dicebear.com/api/human/${userEmail.ImageValue}.svg`,
//       language: userEmail.Language,
//       title: userEmail.Title,
//     });
//   } else {
//     res.send("Password Incorrect");
//   }
//   // console.log(`${email} and ${password}`);
// } catch (err) {
//   res.status(400).send("Invalid Email");
// }
// });

// const createToken = async () => {
//   const token = await jwt.sign(
//     { _id: "6167b269764578add07d479d" },
//     "mynameisrishikeshpolasa"
//   );
//   console.log(token);
//   const userVer = await jwt.verify(token, "mynameisrishikeshpolasa");
//   console.log(userVer);
// };

// createToken();

app.listen(port, () => {
  console.log(`Server is up and running at port no ${port}`);
});
