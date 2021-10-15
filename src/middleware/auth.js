const jwt = require("jsonwebtoken");
const Register = require("../models/registers");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    console.log(token);
    const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
    console.log("verified user" + verifyUser);
    const user = await Register.findOne({ _id: verifyUser._id });
    console.log(user.Name);
    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send(err);
  }
};

module.exports = auth;
