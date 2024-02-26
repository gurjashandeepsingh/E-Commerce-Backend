import express from "express";
const router = express.Router();
import { validationResult, body } from "express-validator";
import { user } from "../../models/user/userModel.js";
import { AuthenticationService } from "../../service/AuthenticationServices/LoginAndRegistrationService.js";

// This code defines a route for logging in a user, with validation for email and password fields. It uses the express framework and a custom AuthenticationService class to handle the login process.
const saveUserValidation = [
  body("email")
    .notEmpty()
    .isEmail()
    .withMessage("Please provide a valid Email address"),
  body("password").notEmpty().withMessage("Please provide password"),
];
router.post("/loginUser", saveUserValidation, async (request, response) => {
  const validationError = validationResult(request);
  if (!validationError.isEmpty()) {
    return response.status(400).json({
      errors: validationError.array(),
    });
  }
  try {
    const { email, password } = request.body;
    const loginUserInstance = new AuthenticationService();
    const result = await loginUserInstance.loginUser(email, password);
    console.log(result);
    response.status(200).send(result);
  } catch (error) {
    response.status(400).send(error);
    console.log(error);
  }
});

// This is a JavaScript code for registering a user with validation checks for email, password, confirm password, phone, name, and address.
const registerUserValidation = [
  body("email").toLowerCase().notEmpty().isEmail().withMessage("Email missing"),
  body("password").notEmpty().withMessage("Password Missing"),
  body("confirmPassword").notEmpty().withMessage("please confirm password"),
  body("phone").notEmpty().withMessage("Contact missing"),
  body("name").notEmpty().withMessage("Name Missing"),
  body("address").notEmpty().withMessage("Address Missing"),
];

router.post(
  "/registerUser",
  registerUserValidation,
  async (request, response) => {
    const validationError = validationResult(request);
    if (!validationError.isEmpty()) {
      return response.status(400).json({
        errors: validationError.array(),
      });
    }
    try {
      const { email, name, password, confirmPassword, address, phone } =
        request.body;
      const registration = new AuthenticationService();
      const Register = await registration.registerUser(
        email,
        name,
        password,
        confirmPassword,
        address,
        phone
      );
      response.status(200).send(Register);
    } catch (error) {
      response.status(400).send(error.message || error);
      console.log(error);
    }
  }
);

export { router as LoginRegistrationRoute };
