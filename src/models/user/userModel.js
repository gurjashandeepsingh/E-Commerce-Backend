import mongoose from "mongoose";
import validator from "validator";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
  },
  email: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email id");
      }
    },
  },
  phone: {
    type: Number,
    required: true,
    min: 10,
  },
  password: {
    type: String,
    minLength: 8,
  },
  confirmpassword: {
    type: String,
    minLength: 8,
  },
  address: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// we need a collection
const user = mongoose.model("user", userSchema);

export { user };
