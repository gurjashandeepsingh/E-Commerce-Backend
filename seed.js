import mongoose from "mongoose";
import { Product } from "./src/models/product/productModel.js";
import { Category } from "./src/models/category/categoryModel.js";
import { order as Order } from "./src/models/orders/orderModel.js";
import { cart as Cart } from "./src/models/cart/cartModel.js";
import { user as User } from "./src/models/user/userModel.js";

// Define Mongoose connection URI with the name of the new database
const mongoURI = "mongodb://127.0.0.1:27017/Triveous";

// Define dummy data for each table
const categories = [
  { category: "Electronics" },
  { category: "Clothing" },
  { category: "Books" },
];

const products = [
  {
    name: "Laptop",
    price: 1000,
    description: "Powerful laptop",
    category: "Electronics",
    availability: true,
  },
  {
    name: "T-shirt",
    price: 20,
    description: "Comfortable t-shirt",
    category: "Clothing",
    availability: true,
  },
  {
    name: "Book",
    price: 15,
    description: "Interesting book",
    category: "Books",
    availability: true,
  },
];

const orders = [
  {
    amount: 500,
    items: ["Laptop", "T-shirt"],
    userId: "user1",
    shippingAddress: "123 Street, City",
    paymentInfo: "Payment details",
    status: "pending",
  },
];

const carts = [];

const users = [ 
  {
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    password: "password",
    confirmpassword: "password",
    address: "456 Avenue, Town",
  },
];

// Connect to MongoDB database
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Connected to MongoDB");

    // Insert dummy data into each collection
    await Category.insertMany(categories);
    console.log("Categories seeded");

    await Product.insertMany(products);
    console.log("Products seeded");

    await Order.insertMany(orders);
    console.log("Orders seeded");

    await Cart.insertMany(carts);
    console.log("Carts seeded");

    await User.insertMany(users);
    console.log("Users seeded");

    // Close the database connection
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  })
  .catch((error) => {
    console.error("Error seeding data:", error);
  });
