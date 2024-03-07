import express, { request } from "express";
const router = express.Router();
import { validationResult, body } from "express-validator";
import { CustomerService } from "../../service/CustomerServices/CustomerServices.js";
import { AuthMiddleware } from "../../middlewares/auth.js";
import { logger } from "../../../winstonLogger.js";

// Category Listing
// An API endpoint that retrieves a list of categories
router.get("/allCategories", async (request, response) => {
  try {
    const getAllCategoriesInstance = new CustomerService();
    const result = await getAllCategoriesInstance.categoryListing();
    response.status(200).send(result);
  } catch (error) {
    console.log(error);
    response.status(400).send(error);
  }
});

// Product Listing
// An API end point that retrieves a list of products with essential details such as title, price, availability based on categoryId
const productListingValidation = [
  body("category").notEmpty().withMessage("category missing"),
];
router.get(
  "/productListing",
  productListingValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      return response.status(400).json({
        errors: validationError.array(),
      });
    }
    try {
      const { category } = request.body;
      const productListingInstance = new CustomerService();
      const result = await productListingInstance.productListing(category);
      response.status(200).send(result);
    } catch (error) {
      response.status(400).send(error);
    }
  }
);

// Product Details
// An API endpoint that retrives product details based on productId
const productDetailsValidation = [
  body("productId").notEmpty().withMessage("Product Id Missing"),
];
router.get(
  "/getProductDetail",
  productDetailsValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      return response.status(400).json({
        errors: validationError.array(),
      });
    }
    try {
      const { productId } = request.body;
      const productDetailInstance = new CustomerService();
      const result = await productDetailInstance.productDetails(productId);
      response.status(200).send(result);
    } catch (error) {
      console.log(error);
      response.status(400).send(error);
    }
  }
);

// Manage Cart
// An API endpoint that helps to maintain the cart
const addToCartValidation = [
  body("cartId")
    .optional()
    .isString()
    .withMessage("Cart id needs to be a string"),
  body("product").isObject().withMessage("product needs to be an object"),
];
router.post(
  "/addToCart",
  new AuthMiddleware().auth,
  addToCartValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      return response.status(400).json({
        errors: validationError.array(),
      });
    }
    try {
      const { cartId, product } = request.body;
      const { id } = request.user;
      const orderHistoryInstance = new CustomerService();
      const result = await orderHistoryInstance.addToCart(product, cartId, id);
      response.status(200).send(result);
    } catch (error) {
      console.log(error);
      return response.status(400).send(error.message || error);
    }
  }
);

// Order Placement
// An API endpoint to help users to place an order for the products in their cart.
const orderPlacementValidation = [
  body("cartId").notEmpty().withMessage("Provide Cart"),
  body("shippingAddress").notEmpty().withMessage("No Address Found"),
  body("paymentInfo").notEmpty().withMessage("No info found on Payment"),
];
router.post(
  "/orderPlacement",
  new AuthMiddleware().auth,
  orderPlacementValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      return response.status(400).json({
        errors: validationError.array(),
      });
    }
    try {
      const { cartId, shippingAddress, paymentInfo, couponName } = request.body;
      const { id } = request.user;
      const orderPlacementInstance = new CustomerService();
      const result = await orderPlacementInstance.orderPlacement(
        cartId,
        shippingAddress,
        paymentInfo,
        id,
        couponName
      );
      response.status(200).send(result);
    } catch (error) {
      response.status(400).send(error.message || error);
    }
  }
);

// Order History
// An API endpoint that helps to users to fetch order history
router.get(
  "/orderHIstory",
  new AuthMiddleware().auth,
  async (request, response) => {
    try {
      const { id } = request.user;
      const orderHistoryInstance = new CustomerService();
      const result = await orderHistoryInstance.orderHistory(id);
      response.status(200).send(result);
    } catch (error) {
      response.status(400).send(error);
    }
  }
);

// Order Details
// An API endpoint that th that helps to users to fetch order details
const orderDetailsValidation = [
  body("orderId").notEmpty().withMessage("Provide OrderId"),
];
router.get(
  "/orderDetails",
  new AuthMiddleware().auth,
  orderDetailsValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      return response.status(400).json({
        errors: validationError.array(),
      });
    }
    try {
      const { orderId } = request.body;
      const orderHistoryInstance = await new CustomerService();
      const result = await orderHistoryInstance.orderDetails(orderId);
      response.status(200).send(result);
    } catch (error) {
      response.status(400).send(error);
    }
  }
);

/**
 * This code snippet represents a route handler for the "/allOrders" endpoint.
 * It is responsible for retrieving all orders for a specific user.
 * @param {Object} request - The request object.
 * @param {Object} response - The response object.
 * @returns {Object} - The result of the orderHistory method of the CustomerService class.
 * @throws {Error} - If there is a validation error or an error occurs during the orderHistory method.
 */
const allOrdersValidation = [
  body("userId").notEmpty().withMessage("Please provide UserID"),
];
router.get(
  "/allOrders",
  new AuthMiddleware().auth,
  allOrdersValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      return response.status(400).json({
        errors: validationError.array(),
      });
    }
    try {
      const { userId } = request.body;
      const allOrdersInstance = await new CustomerService();
      const result = await allOrdersInstance.orderHistory(userId);
      response.status(200).send(result);
    } catch (error) {
      response.status(400).send(error);
    }
  }
);

// Active Cart
// An API endPoint that checks if the cart exists or not
router.get(
  "/getActiveCart",
  new AuthMiddleware().auth,
  async (request, response) => {
    try {
      const { id } = request.user;
      const orderHistoryInstance = new CustomerService();
      const result = await orderHistoryInstance.getActiveCart(id);
      logger.info(result);
      return response.status(200).send(result);
    } catch (error) {
      console.log(error);
      logger.error(error);
      response.status(400).send(error);
    }
  }
);

/**
 * This code snippet represents a route handler for updating a user's information.
 * @param {Object} request - The request object.
 * @param {Object} response - The response object.
 * @returns {Promise} - A promise that resolves to the updated user information.
 * @throws {Error} - If the required parameters are not provided.
 */
const updateUserValidation = [
  body("userId").notEmpty().withMessage("Provide User"),
  body("fieldName").notEmpty().withMessage("Provide Field Name"),
  body("fieldValue").notEmpty().withMessage("Provide Field value"),
];
router.post(
  "/updateUser",
  new AuthMiddleware().auth,
  updateUserValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      throw new Error("Provide parameters");
    }
    try {
      const { userId, fieldName, fieldValue } = request.body;
      const updateUserInstance = await new CustomerService();
      const result = await updateUserInstance.updateUser(
        userId,
        fieldName,
        fieldValue
      );
      logger.info(result);
      response.status(200).send(result);
    } catch (error) {
      logger.error(error);
      response.status(400).send(error);
    }
  }
);

/**
 * Retrieves a list of products based on a search string.
 * @param {Object} request - The request object.
 * @param {Object} response - The response object.
 * @returns {Promise} - A promise that resolves to the search results.
 * @throws {Error} - If there is an error retrieving the search results.
 */
router.get("/searchProduct", async (request, response) => {
  try {
    const { searchString } = request.query;
    const searchProductInstance = await new CustomerService();
    const result = await searchProductInstance.searchProducts(searchString);
    response.status(200).send(result);
    logger.info(result);
  } catch (error) {
    response.status(400).send(error);
    logger.error(error);
  }
});

const userDashboardValidation = [
  body("userId").notEmpty().withMessage("Please provide User ID"),
];
router.get(
  "/userDashboard",
  new AuthMiddleware().auth,
  userDashboardValidation,
  async (request, response) => {
    try {
      const validationError = validationResult(request);
      if (!validationError.isEmpty()) {
        throw new Error("Please provide  valid inputs!");
      }
      const { userId } = request.body;
      const userDashboardInstance = await new CustomerService();
      const result = await userDashboardInstance.userDashboard(userId);
      response.status(200).send(result);
      logger.info(result);
    } catch (error) {
      response.status(400).send(error);
      logger.error(error);
    }
  }
);

export { router as CustomerRouter };
