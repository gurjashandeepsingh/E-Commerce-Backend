import mongoose, { mongo } from "mongoose";
import validator from "validator";
import { Category } from "../category/categoryModel.js";

const productSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
    minLength: 3,
    maxLength: 50,
    trim: true,
  },
  price: {
    type: Number,
    require: true,
    min: 0,
  },
  description: {
    type: String,
    require: true,
    minLength: 5,
    maxLength: 2000,
    trim: true,
  },
  category: {
    type: String,
    require: true,
  },
  availability: {
    type: Boolean,
    require: true,
    default: true,
  },
});

const Product = mongoose.model("product", productSchema);
export { Product };
