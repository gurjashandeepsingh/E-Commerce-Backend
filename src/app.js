import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bodyParser from "body-parser";
import express from "express";
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
  mongoose
    .connect("mongodb://127.0.0.1:27017/Triveous", {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      autoCreate: true,
    })
    .then(() => {
      console.log("Database Connected");
    })
    .catch((Error) => {
      console.log(Error);
    });
}

// Server Run
function runServer(port) {
  app.listen(process.env.PORT, (request, response) => {
    console.log(`Server Connected`);
  });
}

function startup() {
  databaseConnection();
  runServer();
}

startup();
