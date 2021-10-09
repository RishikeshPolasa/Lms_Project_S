const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/LmsProject", {
    useNewUrlParser: true, //deprication warnings
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => {
    console.log(err);
  });
