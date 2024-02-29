# E-commerce Backend

This is the backend for an E-commerce platform built with Node.js and MongoDB.

## Introduction

This project provides the backend functionality for an E-commerce platform. It includes features such as user authentication, product management, order processing and email Service through Twillio Sendgrid.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js installed on your local machine. You can download it from [nodejs.org](https://nodejs.org/).
- MongoDB installed and running on your local machine. You can download it from [mongodb.com](https://www.mongodb.com/).

## Installation

To install the project, follow these steps:

1. Clone the repository:
   ```git@github.com:gurjashandeepsingh/E-Commerce-Backend.git```

2. Navigate to the project directory:

   ```cd e-commerce-backend```

3. Install dependencies:

   ```npm install```

## Configuration
Before running the project, you need to configure the environment variables. Create a .env file in the root directory of the project and add the following variables:

## MongoDB connection URI
MONGODB_URI=mongodb://localhost:27017/ECommerce 

## JWT secret key for authentication
JWT_GENERATION_KEY = "SecureKeyForJwtGeneration"
Replace your_secret_key with a random string used to sign JWT tokens.

## Usage
Run seed file using the following command:

   ```npm run seed```


To start the server, run the following command:
   
   ```npm run start```

The server will start running on port 9000 by default.

To change port add env variable:
```PORT```

# Usage
Steps for Login functionality:

1. Register User using registration API

2. Login that User usgin login API

3. Save the token returned and use it under ```token``` Request Header in all protected API routes.

Time taken to complete : 3 Days
