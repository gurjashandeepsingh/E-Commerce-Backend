import dotenv from "dotenv";
import { response } from "express";
dotenv.config();
import jwt from "jsonwebtoken";

/**
 * The JwtToken class is responsible for generating JWT tokens.
 * @class
 * @name JwtToken
 */
class JwtToken {
  /**
   * Generates a JWT token for the given id and tokens.
   * @param {string} id - The id to be included in the token.
   * @param {object} tokens - The tokens to be used for generating the token.
   * @returns {string} The generated JWT token.
   * @throws {Error} If there is an error while generating the JWT token.
   */
  async jwtTokenGeneration(id, tokens) {
    try {
      const token = jwt.sign(
        { id: id.toString() },
        process.env.jwtGenerationKey
      );
      return token;
    } catch (error) {
      console.log(error);
      throw new Error("Error while generating JWT Token", error);
    }
  }
}

export { JwtToken };
