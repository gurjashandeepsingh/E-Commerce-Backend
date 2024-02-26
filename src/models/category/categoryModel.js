import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    require: true,
    trim: true,
    minLength: 3,
    maxLength: 20,
  },
});

const Category = mongoose.model("Category", categorySchema);
export { Category };
