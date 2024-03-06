import express, { request, response } from "express";
const router = express.Router();
import { validationResult, body } from "express-validator";
import { MerchantService } from "../../service/MerchantServices/MerchantServices.js";
import { AuthMiddleware } from "../../middlewares/auth.js";
import { logger } from "../../../winstonLogger.js";

// No Need for The Merchant to register as there will be only one Merchant. This API is just for testing purpose
const registerValidation = [
  body("name").notEmpty().trim().withMessage("Provivde Merchant Name"),
  body("email").isEmail().notEmpty().withMessage("Provide email"),
  body("password").notEmpty().withMessage("Provide password"),
  body("confirmPassword").notEmpty().withMessage("Provide confirm password"),
  body("businessName").notEmpty().trim().withMessage("Provide business name"),
  body("phoneNUmber").optional(),
  body("website").optional(),
  body("logo").optional(),
  body("description").optional(),
  body("address").optional(),
];
router.post(
  "/registerMerchant",
  registerValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      throw new Error("Provide proper parameters");
    }
    try {
      const {
        name,
        email,
        password,
        confirmPassword,
        businessName,
        phoneNumber,
        website,
        logo,
        description,
        address,
      } = request.body;
      const registerInstance = await new MerchantService();
      const result = await registerInstance.registerMerchant(
        name,
        email,
        password,
        confirmPassword,
        businessName,
        phoneNumber,
        website,
        logo,
        description,
        address
      );
      logger.info(result);
      response.status(200).send(result);
    } catch (error) {
      logger.error(error);
      response.status(400).send(error);
    }
  }
);

// This is a JavaScript code for handling merchant login validation and authentication using Express router and MerchantService.

const loginValidation = [
  body("email").notEmpty().withMessage("Provide Email"),
  body("password").notEmpty().withMessage("Provide password"),
];
router.post("/loginMerchant", loginValidation, async (request, response) => {
  const validationError = validationResult(request);
  if (!validationError.isEmpty()) {
    throw new Error("Provide proper parameters");
  }
  try {
    const { email, password } = request.body;
    const loginInstance = await new MerchantService();
    const result = await loginInstance.loginMerchant(email, password);
    response.status(200).send(result);
  } catch (error) {
    response.status(400).send(error);
  }
});

// This is a JavaScript file containing code for adding a product with validation checks using Express and a MerchantService class.
const addProductValidation = [
  body("name").notEmpty().trim().withMessage("Provide Name"),
  body("price").notEmpty().withMessage("Provide Price"),
  body("description").notEmpty().trim().withMessage("Provide description"),
  body("category").notEmpty().trim().withMessage("Provide Category"),
  body("availability").notEmpty().withMessage("Provide if available or not"),
];
router.post(
  "/addProduct",
  new AuthMiddleware().auth,
  addProductValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      return response.status(400).json({
        errors: validationError.array(),
      });
    }
    try {
      const { name, price, description, category, availability } = request.body;
      const addProductInstance = new MerchantService();
      const result = await addProductInstance.addProduct(
        name,
        price,
        description,
        category,
        availability
      );
      logger.info(result);
      response.status(200).send(result);
    } catch (error) {
      logger.error(error);
      response.status(400).send(error);
    }
  }
);

// This code defines a route to add a product using product ID to the database after validating the request body
const addProductsBulkValidation = [
  body("products").isArray().notEmpty().withMessage("Provide Products"),
];
router.post(
  "/addProductsInBulk",
  new AuthMiddleware().auth,
  addProductsBulkValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      throw new Error("Provide products");
    }
    try {
      const { products } = request.body;
      const addBulkInstance = await new MerchantService();
      const result = await addBulkInstance.addProductsInBulk(products);
      logger.info(result);
      response.status(200).send(result);
    } catch (error) {
      response.status(400).send(error);
    }
  }
);

// This code defines a route to remove a product using product ID from the database after validating the request body
const removeProductValidation = [
  body("productId").notEmpty().withMessage("Provide product ID"),
];
router.post(
  "/removeProduct",
  new AuthMiddleware().auth,
  removeProductValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      throw new Error("Provide product Id");
    }
    try {
      const { productId } = request.body;
      const removeProductInstance = await new MerchantService();
      const result = await removeProductInstance.removeProduct(productId);
      logger.info(result);
      response.status(200).send("Product Deleted");
    } catch (error) {
      logger.error(error);
      response.status(400).send(error);
    }
  }
);

// JavaScript code for handling bulk removal of data in Bulk the MerchantRoutes file
const removeDataBulkValidation = [
  body("productIds").isArray().notEmpty().withMessage("Provide product Ids"),
];
router.post(
  "/removeBulk",
  new AuthMiddleware().auth,
  removeDataBulkValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      throw new Error("Provide product Id");
    }
    try {
      const { productIds } = request.body;
      const removeBulkInstance = await new MerchantService();
      const result = await removeBulkInstance.removeBulk(productIds);
      logger.info(result);
      response.status(200).send(result);
    } catch (error) {
      logger.error(error);
      response.status(400).send(error);
    }
  }
);

// This is a JavaScript code for updating a product in a merchant's routes. It includes validation for the input fields and calls the updateProduct method from the MerchantService class.
const updateProductValidation = [
  body("productId").notEmpty().withMessage("Provide product Ids"),
  body("fieldName").notEmpty().withMessage("Please provide field to update"),
  body("fieldValue")
    .notEmpty()
    .withMessage("Please provide field Value to update"),
];
router.post(
  "/updateProduct",
  new AuthMiddleware().auth,
  updateProductValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      throw new Error("Provide full details for product to update");
    }
    try {
      const { productId, fieldName, fieldValue } = request.body;
      const updateProductInstance = await new MerchantService();
      const result = await updateProductInstance.updateProduct(
        productId,
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

const couponValidation = [
  body("name").notEmpty().withMessage("Please provide coupon code"),
  body("discountPercentage")
    .notEmpty()
    .withMessage("Please provide coupon discount"),
  body("validFrom").notEmpty().withMessage("Please provide valid from date"),
  body("validTo").notEmpty().withMessage("Please provide valid to date"),
];
router.post(
  "/addCoupon",
  new AuthMiddleware().auth,
  couponValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      throw new Error("Provide full details for product to update");
    }
    try {
      const { name, discountPercentage, validFrom, validTo } = request.body;
      const couponInstance = await new MerchantService();
      const result = await couponInstance.createCoupon(
        name,
        discountPercentage,
        validFrom,
        validTo
      );
      response.status(200).json(result);
    } catch (error) {
      logger.error(error);
      response.status(400).send(error);
    }
  }
);

const prorductDetailsValidation = [
  body("productId").notEmpty().withMessage("Provide product Id"),
];
router.post(
  "/getProductDetailMerchant",
  new AuthMiddleware().auth,
  prorductDetailsValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      throw new Error("Product product ID");
    }
    try {
      const { productId } = request.body;
      const productInstance = await new MerchantService();
      const result = await productInstance.productDetailsMerchant(productId);
      response.status(200).send(result);
      logger.info(result);
    } catch (error) {
      response.status(400).send(error);
      logger.error(error);
    }
  }
);

export { router as MerchantRoutes };
