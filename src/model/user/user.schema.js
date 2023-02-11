const mongoose = require("mongoose")

const Schema = mongoose.Schema

let userSchema = new Schema({
  name: {
    type: String,
    maxlength: 50,
    required: true,
  },
  company: {
    type: String,
    maxlength: 50,
    required: true,
  },
  address: {
    type: String,
    maxlength: 100,
  },
  phone: {
    type: Number,
    maxlength: 11,
  },
  email: {
    type: String,
    maxlength: 50,
    required: true,
  },
  password: {
    type: String,
    minlength: 8,
    maxlength: 100,
    required: true,
  },
    refreshJWT: {
      token: {
        type: String,
        maxlength: 500,
        default: "",
      },
      addedAt: {
        type: Date,
        required: true,
        default: Date.now(),
      },
    },
  //   isVerified: {
  //     type: Boolean,
  //     required: true,
  //     default: false,
  //   },
})
userSchema.index({ email: 1 }, { unique: true })

module.exports = {
  userSchema: mongoose.model("user", userSchema)
}
