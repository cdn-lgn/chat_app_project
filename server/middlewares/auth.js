import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler.js";
import { adminSecretKey } from "../index.js";
import { TryCatch } from "./error.js";
import { USER_TOKEN } from "../constants/config.js";
import { User } from "../models/user.js";

// Middleware to check if user is authenticated
const isAuthenticatedMiddleware = TryCatch((req, res, next) => {
  // Retrieve token from cookies
  const token = req.cookies[USER_TOKEN];

  // If token is not present, user is not authenticated
  if (!token)
    return next(new ErrorHandler("Please login to access this route", 401));

  // Verify the token using JWT_TOKEN from environment variables
  const decodedData = jwt.verify(token, process.env.JWT_TOKEN);

  // Attach user ID from decoded token to request object
  req.user = decodedData._id;

  // Move to the next middleware/route handler
  next();
});

// Middleware to restrict access to admin-only routes
const adminOnly = (req, res, next) => {
  // Retrieve admin token from cookies
  const token = req.cookies["admin-token"];

  // If admin token is not present, deny access
  if (!token)
    return next(new ErrorHandler("Only Admin can access this route", 401));

  // Verify the admin token against the adminSecretKey
  const secretKey = jwt.verify(token, process.env.JWT_TOKEN);

  // Check if the secretKey matches the adminSecretKey
  const isMatched = secretKey === adminSecretKey;

  // If secret key doesn't match, deny access
  if (!isMatched)
    return next(new ErrorHandler("Only Admin can access this route", 401));

  // Move to the next middleware/route handler
  next();
};

// Middleware for socket.io authentication
const socketAuthenticator = async (err, socket, next) => {
  try {
    // Handle errors, if any
    if (err) return next(err);

    // Retrieve auth token from socket cookies
    const authToken = socket.request.cookies[USER_TOKEN];

    // If auth token is not present, deny socket connection
    if (!authToken)
      return next(new ErrorHandler("Please login to access this route", 401));

    // Verify the auth token using JWT_TOKEN from environment variables
    const decodedData = jwt.verify(authToken, process.env.JWT_TOKEN);

    // Fetch user details from database using decoded user ID
    const user = await User.findById(decodedData._id);

    // If user not found in database, deny socket connection
    if (!user)
      return next(new ErrorHandler("Please login to access this route", 401));

    // Attach user object to socket for further processing
    socket.user = user;

    // Move to the next middleware/route handler
    return next();
  } catch (error) {
    // Handle any unexpected errors
    console.log(error);
    return next(new ErrorHandler("Please login to access this route", 401));
  }
};

// Export the middleware functions for use in other parts of the application
export { isAuthenticatedMiddleware, adminOnly, socketAuthenticator };
