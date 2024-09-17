import { body, param, validationResult } from "express-validator"; // Importing necessary functions from express-validator
import ErrorHandler from "../utils/ErrorHandler.js";

// Validation handler middleware
const validateHandler = (req, res, next) => {
	const errors = validationResult(req); // Extract validation errors from request

	const errorMessages = errors // Format error messages
		.array()
		.map((error) => error.msg)
		.join(", ");

	if (errors.isEmpty())
		return next(); // Proceed to next middleware if no errors
	else next(new ErrorHandler(errorMessages, 400)); // Handle errors with custom error handler
};

// Validator for user registration
const registerValidator = () => [
	body("name", "Please Enter Name").notEmpty(), // Validate name field
	body("username", "Please Enter Username").notEmpty(), // Validate username field
	body("bio", "Please Enter Bio").notEmpty(), // Validate bio field
	body("password", "Please Enter Password").notEmpty(), // Validate password field
];

// Validator for user login
const loginValidator = () => [
	body("username", "Please Enter Username").notEmpty(), // Validate username field
	body("password", "Please Enter Password").notEmpty(), // Validate password field
];

// Validator for creating a new group
const newGroupValidator = () => [
	body("name", "Please Enter Name").notEmpty(), // Validate group name field
	body("members")
		.notEmpty()
		.withMessage("Please Enter Members")
		.isArray({ min: 2, max: 100 })
		.withMessage("Members must be 2-100"), // Validate members array field
];

// Validator for adding members to a group
const addMemberValidator = () => [
	body("chatId", "Please Enter Chat ID").notEmpty(), // Validate chat ID field
	body("members")
		.notEmpty()
		.withMessage("Please Enter Members")
		.isArray({ min: 1, max: 97 })
		.withMessage("Members must be 1-97"), // Validate members array field
];

// Validator for removing a member from a group
const removeMemberValidator = () => [
	body("chatId", "Please Enter Chat ID").notEmpty(), // Validate chat ID field
	body("userId", "Please Enter User ID").notEmpty(), // Validate user ID field
];

// Validator for sending attachments to a chat
const sendAttachmentsValidator = () => [
	body("chatId", "Please Enter Chat ID").notEmpty(), // Validate chat ID field
];

// Validator for validating chat ID parameter
const chatIdValidator = () => [param("id", "Please Enter Chat ID").notEmpty()]; // Validate chat ID parameter

// Validator for renaming a group
const renameValidator = () => [
	param("id", "Please Enter Chat ID").notEmpty(), // Validate chat ID parameter
	body("name", "Please Enter New Name").notEmpty(), // Validate new group name field
];

// Validator for sending friend requests
const sendRequestValidator = () => [
	body("userId", "Please Enter User ID").notEmpty(), // Validate user ID field
];

// Validator for accepting friend requests
const acceptRequestValidator = () => [
	body("requestId", "Please Enter Request ID").notEmpty(), // Validate request ID field
	body("accept")
		.notEmpty()
		.withMessage("Please Add Accept")
		.isBoolean()
		.withMessage("Accept must be a boolean"), // Validate accept field
];

// Validator for admin login
const adminLoginValidator = () => [
	body("secretKey", "Please Enter Secret Key").notEmpty(), // Validate secret key field
];

// Exporting all validators and the validation handler middleware
export {
	acceptRequestValidator,
	addMemberValidator,
	adminLoginValidator,
	chatIdValidator,
	loginValidator,
	newGroupValidator,
	registerValidator,
	removeMemberValidator,
	renameValidator,
	sendAttachmentsValidator,
	sendRequestValidator,
	validateHandler,
};
