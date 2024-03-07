import { cart } from "../../models/cart/cartModel.js";
import { user } from "../../models/user/userModel.js";
import { order } from "../../models/orders/orderModel.js";
import { Product } from "../../models/product/productModel.js";
import { redis } from "../../app.js";
import { CouponService } from "../CouponService/CouponServices.js";
// import { client } from "../../app.js";
// import { redisClient } from "../../app.js";

// ## Summary
// The `CustomerService` class provides various methods for managing categories, products, and orders in an e-commerce system. It allows users to retrieve category listings, product listings, product details, add items to the cart, place orders, view order history, and get order details.

// ## Code Analysis
// ### Main functionalities
// - Retrieve category listings
// - Retrieve product listings by category
// - Retrieve product details by product ID
// - Add items to the cart
// - Place orders
// - View order history
// - Get order details
// ___

class CustomerService {
  // Category Listing
  // - `categoryListing()`: Retrieves all categories available in the system.
  // const categories = await customerService.categoryListing();
  // console.log(categories);
  // // Output: ['category1', 'category2', ...]

  async categoryListing() {
    const getAllCategories = await Product.distinct("category");
    return getAllCategories;
  }

  // Product Listing
  // - `productListing(category)`: Retrieves all products in a specific category.
  // const products = await customerService.productListing('category1');
  // console.log(products);
  // // Output: [{ title: 'product1', id: '123', category: 'category1', price: 10, description: '...', availability: true }, ...]
  async productListing(category) {
    const products = await Product.find({ category });
    const productData = products.map((product) => {
      return {
        title: product.name,
        id: product._id,
        category: product.category,
        price: product.price,
        description: product.description,
        availability: product.availability,
      };
    });
    return productData;
  }

  /**
   * Retrieves the details of a specific product.
   * @param {string} productId - The ID of the product to retrieve details for.
   * @returns {Promise<object>} - The details of the product.
   */
  async productDetails(productId) {
    // let product;
    const cachedData = await redis.get(productId);
    console.log(typeof cachedData);
    console.log(cachedData);
    if (cachedData) {
      return JSON.parse(cachedData);
    } else {
      const productInformation = await Product.findOne({ _id: productId });
      if (productInformation) {
        const productInfo = JSON.stringify(productInformation);
        await redis.set(productId, productInfo);
      }
      return productInformation;
    }
    return product;
  }

  // Order Placement
  // - `orderPlacement(cartId, shippingAddress, paymentInfo, userId)`: Places an order using the items in the user's cart.
  // const newOrder = await customerService.orderPlacement('789', 'shipping address', 'payment info', '456');
  // console.log(newOrder);
  // // Output: new order object

  async orderPlacement(
    cartId,
    shippingAddress,
    paymentInfo,
    userId,
    couponName
  ) {
    const findCart = await cart.findOne({
      _id: cartId,
      isActive: true,
      userId,
    });
    if (!findCart) {
      throw new Error("Cart not found or inactive");
    }
    let amount = 0;
    const productIds = [];
    findCart.items.forEach((item) => {
      productIds.push(item.productId);
    });
    const productsObj = {};
    const products = await Product.find({ _id: { $in: productIds } });
    products.forEach((product) => {
      productsObj[product._id] = product;
    });
    findCart.items.forEach((item) => {
      if (productsObj[item.productId]) {
        amount += productsObj[item.productId].price * item.quantity;
      }
    });
    if (couponName) {
      const couponServiceInstance = await new CouponService();
      amount = await couponServiceInstance.discountAmount(amount, couponName);
    }
    const newOrder = new order({
      amount,
      items: findCart.items,
      userId,
      shippingAddress: shippingAddress,
      paymentInfo: paymentInfo,
      status: "Success [Amex Credit Card]",
    });
    findCart.isActive = false;
    findCart.save();
    newOrder.save();
    return newOrder;
  }

  /**
   * Retrieves all order History for a specific user.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<Array>} - An array of order objects.
   * @throws {Error} - If no orders are found for the user.
   */
  async orderHistory(userId) {
    const checkOrders = await order.find({ userId });
    if (!checkOrders) throw new Error("Not found");
    return checkOrders;
  }

  // Order Details
  // - `orderDetails(orderId, userId)`: Retrieves the details of a specific order.
  // const orderDetails = await customerService.orderDetails('789', '456');
  // console.log(orderDetails);
  // // Output: order details object
  async orderDetails(orderId) {
    const orderFound = await order.findOne({ _id: orderId });
    if (!orderFound) throw new NotFoundError();
    return orderFound;
  }

  // Add Item to Cart
  // - `addItemToCart(productId, userId)`: Adds an item to the user's cart.
  // const updatedCart = await customerService.addItemToCart('123', '456');
  // console.log(updatedCart);
  // // Output: updated cart object
  async addToCart(product, cartId, userId) {
    let cartToAddTo = new cart();
    if (cartId) {
      cartToAddTo = await cart.findOne({ _id: cartId, isActive: true });
      if (!cartToAddTo) throw new Error("Cart does not exist or is inactive");
      const existingItemInProduct = cartToAddTo.items.filter(
        (item) => JSON.stringify(product.id) == JSON.stringify(item.productId)
      );
      if (existingItemInProduct && existingItemInProduct.length == 1) {
        // Assuming 'itemToRemove' represents the object you want to remove from the array
        cartToAddTo.items = cartToAddTo.items.filter(
          (item) => item !== existingItemInProduct[0]
        );
        product.quantity += existingItemInProduct[0].quantity;
      }
    } else {
      await cart.updateMany({ userId }, { isActive: false });
    }
    const existingProduct = await Product.findOne({ _id: product.id });
    if (!existingProduct) throw new Error("Product does not exist");
    if (product.quantity < 0) product.quantity = 0;
    if (product.quantity !== 0) {
      cartToAddTo.items.push({
        productId: product.id,
        quantity: product.quantity,
      });
    }
    cartToAddTo.userId = userId;
    cartToAddTo.save();
    return cartToAddTo;
  }

  async getActiveCart(userId) {
    return await cart.findOne({ userId, isActive: true });
  }

  /**
   * Updates a user's information.
   * @param {string} userId - The ID of the user to update.
   * @param {string} fieldName - The name of the field to update.
   * @param {any} fieldValue - The new value for the field.
   * @returns {Promise<object>} - The updated user object.
   * @throws {Error} - If the user cannot be found or updated.
   */
  async updateUser(userId, fieldName, fieldValue) {
    const updateData = {};
    updateData[fieldName] = fieldValue;

    const updateUser = await user.findOneAndUpdate(
      { _id: userId },
      updateData,
      { new: true }
    );
    if (!updateUser) {
      throw new Error("Cannot update User");
    }
    return updateUser;
  }

  /**
   * Searches for products based on a given search string.
   * @param {string} searchString - The search string to match against product names, descriptions, and categories.
   * @returns {Promise<Array>} - An array of products that match the search criteria.
   */
  async searchProducts(searchString) {
    const regex = new RegExp(`.*${searchString}.*`, "i"); // case insensitive

    try {
      const products = await Product.find({
        $or: [
          { name: { $regex: regex } }, // Case-insensitive search by name
          { description: { $regex: regex } }, // Case-insensitive search by description
          { category: { $regex: regex } }, // Case-insensitive search by category
        ],
      });
      return products;
    } catch (e) {
      console.error("Error while searching products:", e);
      throw e; // Rethrow the error to propagate it to the caller
    }
  }

  async userDashboard(userId) {
    const findUser = await user.findOne({ _id: userId });
    if (!findUser) {
      throw new Error("User not Found");
    }
    const orders = await this.orderHistory(userId);
    return { findUser, orders };
  }
}

export { CustomerService };
