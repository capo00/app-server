const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Config = require("../config/config");

function generateNumId(text) {
  let n = 0;
  for (let i = 0; i < text.length; i++) {
    n += text.codePointAt(i);
  }
  let numText = n + "";
  let i = 0;
  while (numText.length > 3 && i < 100) {
    const halfI = Math.round(numText.length / 2);
    const num1 = +numText.substring(0, halfI);
    const num2 = +numText.substring(halfI, numText.length);
    numText = (num1 + num2) + "";
    i++;
  }
  return numText;
}

// TODO check if it should not be closed somehow
mongoose.connect(Config.mongodbUri, { dbName: Config.mongodbName });

const sysSchema = new mongoose.Schema({
  cts: {
    type: Date,
  }
});

const IdentitySchema = new mongoose.Schema({
  id: { type: String, required: true, trim: true },
  name: {
    type: String,
    trim: true,
    required: [true, "Please provide a name"],
    minlength: 3,
    maxlength: 56,
  },
  email: {
    type: String,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email.",
    ],
    unique: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: false,
  },
  registrationType: {
    type: String,
    required: false,
  },
  sys: sysSchema,
});

IdentitySchema.methods.generateToken = function () {
  const token = jwt.sign({ id: this._id }, Config.token.jwtSecret, {
    expiresIn: Config.token.jwtLifetime,
  });
  return token;
};

const Identity = mongoose.model("Identity", IdentitySchema, "identity");

Identity.generateId = (email, time) => [generateNumId(email), generateNumId(time), "1"].join("-");

module.exports = Identity;