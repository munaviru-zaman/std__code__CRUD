const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  shinobi_name: {
    type: String,
    required: true,
  },
  shinobi_clan: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
    default: "",
  },
  verified: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Shinobi = mongoose.model("Shinobi", userSchema);
module.exports = Shinobi;
