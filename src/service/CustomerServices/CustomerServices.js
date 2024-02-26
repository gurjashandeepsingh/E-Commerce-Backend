import { cart } from "../../models/cart/cartModel.js";
import { user } from "../../models/user/userModel.js";
import { order } from "../../models/orders/orderModel.js";
import { Product } from "../../models/product/productModel.js";

// ## Summary
// The `CustomerService` class provides various methods for managing categories, products, and orders in an e-commerce system. It allows users to retrieve category listings, product listings, product details, add items to the cart, place orders, view order history, and get order details.

// ## Example Usage
// const customerService = new CustomerService();

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
// ### Fields
// - `cart`: Represents the cart model.
// - `order`: Represents the order model.
// - `Product`: Represents the product model.
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

  // Product Details
  // - `productDetails(productId)`: Retrieves the details of a specific product.
  // const productDetails = await customerService.productDetails('123');
  // console.log(productDetails);
  // // Output: { title: 'product1', id: '123', category: 'category1', price: 10, description: '...', availability: true }

  async productDetails(productId) {
    const productInformation = await Product.findOne({ _id: productId });
    if (!productInformation) {
      throw new Error("No details found.");
    }
    return productInformation;
  }

  // Order Placement
  // - `orderPlacement(cartId, shippingAddress, paymentInfo, userId)`: Places an order using the items in the user's cart.
  // const newOrder = await customerService.orderPlacement('789', 'shipping address', 'payment info', '456');
  // console.log(newOrder);
  // // Output: new order object

  async orderPlacement(cartId, shippingAddress, paymentInfo, userId) {
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
    const newOrder = new order({
      amount,
      items: findCart.items,
      userId,
      shippingAddress: shippingAddress,
      paymentInfo: paymentInfo,
    });
    findCart.isActive = false;
    findCart.save();
    newOrder.save();
    return newOrder;
  }

  // // Get order history
  // - `orderHistory(userId)`: Retrieves the order history of a user.
  // const orderHistory = await customerService.orderHistory('456');
  // console.log(orderHistory);
  // // Output: array of order objects
  async orderHistory(userId) {
    const orderHistoryOfUser = await order.findAll({ userId });
    if (!orderHistoryOfUser) {
      throw new Error("No order history");
    }
    return orderHistoryOfUser;
  }

  // Order Details
  // - `orderDetails(orderId, userId)`: Retrieves the details of a specific order.
  // const orderDetails = await customerService.orderDetails('789', '456');
  // console.log(orderDetails);
  // // Output: order details object
  async orderDetails(orderId, userId) {
    const orderResult = await order.findOne({ orderId, userId });
    return orderResult;
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
}

export { CustomerService };
