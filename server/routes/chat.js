import express from "express";
import {
	addMembers,
	deleteChat,
	getChatDetails,
	getMessages,
	getMyChats,
	getMyGroups,
	leaveGroup,
	newGroupChat,
	removeMember,
	renameGroup,
	sendAttachments,
} from "../controllers/chat.js";
import {
	addMemberValidator,
	chatIdValidator,
	newGroupValidator,
	removeMemberValidator,
	renameValidator,
	sendAttachmentsValidator,
	validateHandler,
} from "../lib/validators.js";
import { isAuthenticatedMiddleware } from "../middlewares/auth.js";
import { attachmentsMulter } from "../middlewares/multer.js";

const app = express.Router();

// Middleware to ensure user is authenticated for all routes below
app.use(isAuthenticatedMiddleware);

// Route to create a new group chat
app.post("/new", newGroupValidator(), validateHandler, newGroupChat);

// Route to get all chats of the authenticated user
app.get("/my", getMyChats);

// Route to get all group chats of the authenticated user
app.get("/my/groups", getMyGroups);

// Route to add members to a group chat
app.put("/addmembers", addMemberValidator(), validateHandler, addMembers);

// Route to remove a member from a group chat
app.put(
	"/removemember",
	removeMemberValidator(),
	validateHandler,
	removeMember,
);

// Route to leave a group chat
app.delete("/leave/:id", chatIdValidator(), validateHandler, leaveGroup);

// Route to send attachments to a chat
app.post(
	"/message",
	attachmentsMulter,
	sendAttachmentsValidator(),
	validateHandler,
	sendAttachments,
);

// Route to get messages of a specific chat
app.get("/message/:id", chatIdValidator(), validateHandler, getMessages);

// Route to handle chat details, renaming, and deletion
app.route("/:id")
	.get(chatIdValidator(), validateHandler, getChatDetails) // Get details of a specific chat
	.put(renameValidator(), validateHandler, renameGroup) // Rename a group chat
	.delete(chatIdValidator(), validateHandler, deleteChat); // Delete a chat

export default app;
