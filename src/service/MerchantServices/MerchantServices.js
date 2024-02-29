import { Product } from "../../models/product/productModel.js";
import { Merchant } from "../../models/merchant/merchantModel.js";
import { order } from "../../models/orders/orderModel.js";
import { JwtToken } from "../AuthenticationServices/jwtAuthentication.js";
import bcrypt from "bcrypt";
import { user } from "../../models/user/userModel.js";

/**
 * The MerchantService class provides methods for managing products in a merchant's inventory.
 * @class
 * @name MerchantService
 */
class MerchantService {
  async registerMerchant(
    name,
    email,
    password,
    confirmPassword,
    businessName,
    phone,
    website,
    logo,
    description,
    address
  ) {
    if (password === confirmPassword) {
      const hashPassword = await bcrypt.hash(password, 10);
      const mainMerchant = new Merchant({
        name,
        email,
        password: hashPassword,
        businessName,
        phone,
        website,
        logo,
        description,
        address,
      });
      const savedMerchant = await mainMerchant.save();
      return savedMerchant;
    }
  }
  async loginMerchant(email, password) {
    const checkEmail = await Merchant.findOne({ email });
    if (!checkEmail) {
      throw new Error("Wrong Email");
    }
    const checkPassword = await bcrypt.compare(password, checkEmail.password);
    if (!checkPassword) {
      throw new Error("Password wrong");
    }
    const jwtTokenInstance = new JwtToken();
    const token = await jwtTokenInstance.jwtTokenGeneration(checkEmail._id);
    const allOrders = await order.find();
    return { allOrders, token };
  }

  /**
   * Adds a new product to the database.
   * @param {string} name - The name of the product.
   * @param {number} price - The price of the product.
   * @param {string} description - The description of the product.
   * @param {string} category - The category of the product.
   * @param {boolean} availability - The availability of the product.
   * @returns {Promise<Product>} - The newly added product.
   */
  async addProduct(name, price, description, category, availability) {
    const newProduct = new Product({
      name: name,
      price: price,
      description: description,
      category: category,
      availability: availability,
    });
    const addedProduct = await newProduct.save();
    return addedProduct;
  }

  /**
   * Adds multiple products to the database in bulk.
   * @param {Array<Product>} products - An array of products to be added.
   * @returns {Promise<Array<Product>>} - A promise that resolves to an array of the added products.
   * @throws {Error} - If the products cannot be added.
   */
  async addProductsInBulk(products) {
    const addBulk = await Product.insertMany(products);
    if (!addBulk) {
      throw new Error("Can not add products");
    }
    return addBulk;
  }

  /**
   * Removes a product from the database.
   * @param {string} productId - The ID of the product to be removed.
   * @returns {Promise<Product>} - The deleted product.
   * @throws {Error} - If the product cannot be deleted.
   */
  async removeProduct(productId) {
    const findProduct = await Product.findOne({ _id: productId });
    const deletedProduct = await Product.findOneAndDelete({ findProduct });
    if (!deletedProduct) {
      throw new Error("Can not delete product");
    }
    return deletedProduct;
  }

  /**
   * Removes multiple products from the database.
   * @param {Array<string>} productIds - The IDs of the products to be removed.
   * @returns {Promise<Object>} - The result of the removal operation.
   * @throws {Error} - If the products cannot be deleted.
   */
  async removeBulk(productIds) {
    const removeProducts = await Product.deleteMany({
      _id: { $in: productIds },
    });
    if (!removeProducts) {
      throw new Error("Can not delete products");
    }
    return removeProducts;
  }

  /**
   * Updates a product in the database.
   * @param {string} productId - The ID of the product to be updated.
   * @param {string} fieldName - The name of the field to be updated.
   * @param {any} fieldValue - The new value for the field.
   * @returns {Promise<Product>} - The updated product.
   * @throws {Error} - If the product cannot be updated.
   */
  async updateProduct(productId, fieldName, fieldValue) {
    const updateData = {};
    updateData[fieldName] = fieldValue;
    // Remove `_id` from the updateData object
    if (fieldName === "_id") {
      delete updateData._id;
    }
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId },
      updateData,
      { new: true }
    );
    if (!updatedProduct) {
      throw new Error("Cannot update Product");
    }
    return updatedProduct;
  }
}

export { MerchantService };
