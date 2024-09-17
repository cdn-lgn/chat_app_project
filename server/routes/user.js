import express from "express";
import {
	acceptFriendRequest,
	getMyFriends,
	getMyNotifications,
	getMyProfile,
	login,
	logout,
	newUser,
	searchUser,
	sendFriendRequest,
} from "../controllers/user.js";
import {
	acceptRequestValidator,
	loginValidator,
	registerValidator,
	sendRequestValidator,
	validateHandler,
} from "../lib/validators.js";
import { isAuthenticatedMiddleware } from "../middlewares/auth.js";
import { singleAvatar } from "../middlewares/multer.js";

const app = express.Router();

// Route to register a new user with avatar upload
app.post("/new", singleAvatar, registerValidator(), validateHandler, newUser);

// Route to login a user
app.post("/login", loginValidator(), validateHandler, login);

// After here, user must be logged in to access the routes

app.use(isAuthenticatedMiddleware);

// Route to get current user's profile
app.get("/me", getMyProfile);

// Route to logout user
app.get("/logout", logout);

// Route to search users by name
app.get("/search", searchUser);

// Route to send a friend request
app.put(
	"/sendrequest",
	sendRequestValidator(),
	validateHandler,
	sendFriendRequest,
);

// Route to accept or reject a friend request
app.put(
	"/acceptrequest",
	acceptRequestValidator(),
	validateHandler,
	acceptFriendRequest,
);

// Route to get notifications (friend requests) for current user
app.get("/notifications", getMyNotifications);

// Route to get list of friends for current user
app.get("/friends", getMyFriends);

export default app;
