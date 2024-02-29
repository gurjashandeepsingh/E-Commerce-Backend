import { user } from "../../models/user/userModel.js";
import { JwtToken } from "./jwtAuthentication.js";
import bcrypt from "bcrypt";

/**
 * The AuthenticationService class provides methods for user registration and login.
 * @class
 * @name AuthenticationService
 */
class AuthenticationService {
  /**
   * Registers a new user.
   * @param {string} email - The email of the user.
   * @param {string} name - The name of the user.
   * @param {string} password - The password of the user.
   * @param {string} confirmPassword - The confirmation password of the user.
   * @param {string} address - The address of the user.
   * @param {string} phone - The phone number of the user.
   * @returns {Promise<Object>} - The registered user object.
   * @throws {Error} - If the email already exists.
   */
  async registerUser(email, name, password, confirmPassword, address, phone) {
    if (password === confirmPassword) {
      const checkIfAlreadyExisting = await user.findOne({ email: email });
      if (!checkIfAlreadyExisting) {
        password = await bcrypt.hash(password, 10);
        const User = new user({ name, email, password, phone, address });
        const registeredUser = await User.save();
        return registeredUser;
      } else {
        throw new Error("Email already exists");
      }
    }
  }

  /**
   * Logs in a user.
   * @param {string} email - The email of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise<string>} - The JWT token for the logged in user.
   * @throws {Error} - If the email or password is incorrect.
   */
  async loginUser(email, password) {
    const searchUser = await user.findOne({ email });
    if (searchUser) {
      const isMatch = await bcrypt.compare(password, searchUser.password);
      if (isMatch) {
        const jwtTokenInstance = new JwtToken();
        const token = await jwtTokenInstance.jwtTokenGeneration(searchUser._id);
        return { token, searchUser };
      } else {
        console.log("Password Incorrect");
      }
    }
  }
}

export { AuthenticationService };
