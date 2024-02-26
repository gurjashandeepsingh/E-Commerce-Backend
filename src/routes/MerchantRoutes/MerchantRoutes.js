import express from "express";
const router = express.Router();
import { validationResult, body } from "express-validator";
import { MerchantService } from "../../service/MerchantServices/MerchantServices.js";

// This is a JavaScript file containing code for adding a product with validation checks using Express and a MerchantService class.
const addProductValidation = [
  body("name").notEmpty().trim().withMessage("Provide Name"),
  body("price").notEmpty().withMessage("Provide Price"),
  body("description").notEmpty().trim().withMessage("Provide description"),
  body("category").notEmpty().trim().withMessage("Provide Category"),
  body("availability").notEmpty().withMessage("Provide if available or not"),
];
router.post("/addProduct", addProductValidation, async (request, response) => {
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
    response.status(200).send(result);
    console.log(result);
  } catch (error) {
    response.status(400).send(error);
  }
});

export { router as MerchantRoutes };
