import { Product } from "../../models/product/productModel.js";

/**
 * The MerchantService class provides methods for managing products in a merchant's inventory.
 * @class
 * @name MerchantService
 */
class MerchantService {
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
}

export { MerchantService };
