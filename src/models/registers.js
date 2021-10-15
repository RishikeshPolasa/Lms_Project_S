const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const studentSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  Title: {
    type: String,
    required: true,
  },
  Language: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  ConfirmPassword: {
    type: String,
    required: true,
  },
  ImageValue: {
    type: Number,
    required: true,
  },
  Id: {
    type: String,
    required: true,
  },
});

//generating tokens
studentSchema.methods.generateAuthToken = async function () {
  try {
    console.log(this._id);
    const token = jwt.sign(
      { _id: this._id.toString() },
      process.env.SECRET_KEY
    );
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    // console.log(token);
    return token;
  } catch (err) {
    res.send("the error part" + err);
  }
};

// collection

const Register = new mongoose.model("Register", studentSchema);

module.exports = Register;
