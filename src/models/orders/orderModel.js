import mongoose from "mongoose";
import validator from "validator";

const orderSchema = mongoose.Schema({
  amount: {
    type: Number,
    require: true,
  },
  items: {
    type: Array,
    require: true,
  },
  userId: {
    type: String,
    require: true,
    trim: true,
  },
  shippingAddress: {
    type: Object,
    required: true,
  },
  paymentInfo: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const order = mongoose.model("order", orderSchema);
export { order };
