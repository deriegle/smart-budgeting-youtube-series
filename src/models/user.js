const { model, Schema } = require("mongoose");

module.exports = model(
  "User",
  new Schema({
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      minlength: 4
    }
  })
);
