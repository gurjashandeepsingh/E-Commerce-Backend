import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

/**
 * AuthMiddleware class handles authentication middleware for requests.
 * @class
 * @name AuthMiddleware
 */
class AuthMiddleware {
  // This code defines an async middleware function for authentication using JWT tokens. It verifies the token in the request headers, decodes it, and sets the user ID in the request object if the token is valid.

  async auth(req, res, next) {
    try {
      if (req.headers.token) {
        const token = req.headers.token;
        const decodedToken = jwt.verify(token, process.env.jwtGenerationKey);
        req.user = { id: decodedToken.id };
        return next();
      }
    } catch (error) {
      console.log(error);
      return res.status(401).send("Token invalid");
    }
    return res.status(401).send("Token not found in request");
  }
}

export { AuthMiddleware };
