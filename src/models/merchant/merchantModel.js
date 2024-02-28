import mongoose from "mongoose";

const merchantSchema = new mongoose.Schema({
  name: {
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
  businessName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  website: {
    type: String,
  },
  logo: {
    type: String,
  },
  description: {
    type: String,
  },
});

const Merchant = mongoose.model("Merchant", merchantSchema);

export { Merchant };
