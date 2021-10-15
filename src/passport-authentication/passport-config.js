const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const passport = require("passport");
const Register = require("../models/registers");

// function initialize(passport, getUserByEmail, getUserById) {
//   const authenticateUser = async (email, password, done) => {
//     const user = await getUserByEmail(email);
//     // console.log(password + " " + user.Password);
//     // console.log(user.paths);
//     if (user == null) {
//       return done(null, false, { message: "No user with that email" });
//     }
//     try {
//       if (await bcrypt.compare(password, user.Password)) {
//         return done(null, user);
//       } else {
//         return done(null, false, { message: "Password incorrect" });
//       }
//     } catch (e) {
//       return done(e);
//     }
//   };
//   passport.use(
//     new LocalStrategy(
//       { usernameField: "Email", passwordField: "Password" },
//       authenticateUser
//     )
//   );
//   passport.serializeUser((user, done) => done(null, user.Id));
//   passport.deserializeUser((Id, done) => {
//     return done(null, getUserById(Id));
//   });
// }

passport.use(
  new LocalStrategy(
    {
      usernameField: "Email",
      passwordField: "Password",
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      var register = Register;
      // console.log(password);
      Register.findOne({ Email: email }, function (err, register) {
        if (err) {
          return done(err);
        }
        if (!register) {
          return done(null, false, { message: "Incorrect username." });
        }
        // var cpassword = register.Password
        // console.log(register.Email + "" + email);
        console.log(register.ConfirmPassword + "" + password);
        if (!register || register.ConfirmPassword != password) {
          // req.flash("error", "Invalid Username/Password");
          return done(null, false);
        }

        return done(null, register);
      });
    }
  )
);
// serialize the user to decide which key is to be kept in cookies
passport.serializeUser(function (Register, done) {
  done(null, Register.id);
});

// deserialize the user from key in the cookies
passport.deserializeUser(function (id, done) {
  Register.findById(id, function (err, register) {
    if (err) {
      console.log("Error in finding user --> Passport");
      return done(err);
    }
    console.log("Retrieved User");
    return done(null, register);
  });
});

// Check if user is authenticated
passport.checkAuthentication = function (req, res, next) {
  // If the user is signed in, then pass the request to the controller
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/login");
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    // console.log('Is Authenticated');
    res.locals.user = req.user;
    // console.log('Is Authenticated');
  }
  next();
};

module.exports = passport;
