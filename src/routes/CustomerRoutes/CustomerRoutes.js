import express, { request } from "express";
const router = express.Router();
import { validationResult, body } from "express-validator";
import { CustomerService } from "../../service/CustomerServices/CustomerServices.js";
import { AuthMiddleware } from "../../middlewares/auth.js";

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
      const { cartId, shippingAddress, paymentInfo } = request.body;
      const { id } = request.user;
      const orderPlacementInstance = new CustomerService();
      const result = await orderPlacementInstance.orderPlacement(
        cartId,
        shippingAddress,
        paymentInfo,
        id
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
      const { id } = request.user;
      const orderHistoryInstance = new CustomerService();
      const result = await orderHistoryInstance.orderDetails(orderId, id);
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
      response.status(200).send(result);
    } catch (error) {
      response.status(400).send(error);
    }
  }
);

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
      response.status(200).send(result);
    } catch (error) {
      response.status(400).send(error);
    }
  }
);

export { router as CustomerRouter };
