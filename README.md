# E-commerce Backend

This is the backend for an E-commerce platform built with Node.js and MongoDB.

## Introduction

This project provides the backend functionality for an E-commerce platform. It includes features such as user authentication, product management, order processing, and more.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js installed on your local machine. You can download it from [nodejs.org](https://nodejs.org/).
- MongoDB installed and running on your local machine. You can download it from [mongodb.com](https://www.mongodb.com/).

## Installation

To install the project, follow these steps:

1. Clone the repository:
   ```git clone https://github.com/yourusername/e-commerce-backend.git```

2. Navigate to the project directory:

```cd e-commerce-backend```

3. Install dependencies:

```npm install```

## Configuration
Before running the project, you need to configure the environment variables. Create a .env file in the root directory of the project and add the following variables:

## MongoDB connection URI
MONGODB_URI=mongodb://localhost:27017/Triveous

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
