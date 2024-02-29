import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bodyParser from "body-parser";
import express from "express";
import { logger } from "../winstonLogger.js";
const app = express();

// All File Imports
import { LoginRegistrationRoute } from "./routes/AuthenticationRoutes/LoginAndRegistrationRoute.js";
import { CustomerRouter } from "./routes/CustomerRoutes/CustomerRoutes.js";
import { MerchantRoutes } from "./routes/MerchantRoutes/MerchantRoutes.js";

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/loginOrRegister", LoginRegistrationRoute);
app.use("/customerService", CustomerRouter);
app.use("/merchantRoutes", MerchantRoutes);

// Database Connection
function databaseConnection() {
  const mongoURI =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ECommerce";
  mongoose
    .connect(mongoURI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      autoCreate: true,
    })
    .then(() => {
      logger.info("Database Connected");
    })
    .catch((Error) => {
      logger.error(Error);
    });
}

// Server Run
function runServer(port) {
  app.listen(process.env.PORT, (request, response) => {
    logger.info("Server Running at Port 9000");
  });
}

function startup() {
  databaseConnection();
  runServer();
}

startup();
