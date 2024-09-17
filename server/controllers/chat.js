import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { User } from "../models/user.js";
import { getOtherMember } from "../lib/helper.js";
import { emitEvent } from "../utils/features.js";
import {
	ALERT,
	REFETCH_CHATS,
	NEW_MESSAGE,
	NEW_MESSAGE_ALERT,
} from "../constants/events.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import {
	uploadFilesToCloudinary,
	deletFilesFromCloudinary,
} from "../utils/features.js";
import { Message } from "../models/message.js";

/**
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */

const newGroupChat = TryCatch(async (req, res, next) => {
	const { name, members } = req.body;

	const allMembers = [...members, req.user]; // Include current user as a member

	// Create a new chat document
	await Chat.create({
		name,
		groupChat: true,
		creator: req.user,
		members: allMembers,
	});

	// Emit event to notify members about the new group
	emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);
	emitEvent(req, REFETCH_CHATS, members);

	// Respond with success message
	return res.status(201).json({
		success: true,
		message: "Group created",
	});
});

/**
 * Get all chats where the current user is a member.
 */
const getMyChats = TryCatch(async (req, res, next) => {
	// Find all chats where the current user is a member
	const chats = await Chat.find({ members: req.user }).populate(
		"members",
		"name avatar",
	);

	// Transform chat data for response
	const tranformedChat = chats.map(({ _id, name, members, groupChat }) => {
		const otherMember = getOtherMember(members, req.user);

		return {
			_id,
			groupChat,
			name: groupChat ? name : otherMember.name,
			avatar: groupChat
				? members.slice(0, 3).map(({ avatar }) => avatar.url)
				: [otherMember.avatar.url],
			members: members.reduce((prev, curr) => {
				if (curr._id.toString() !== req.user.toString()) {
					prev.push(curr._id);
				}
				return prev;
			}, []),
		};
	});

	// Respond with transformed chat data
	return res.status(200).json({
		success: true,
		message: tranformedChat,
	});
});

/**
 * Add new members to a group chat.
 */
const addMembers = TryCatch(async (req, res, next) => {
	const { chatID, members } = req.body;
	const chat = await Chat.findById(chatID);

	// Check if chat exists
	if (!chat) return next(new ErrorHandler("Chat not found", 404));

	// Check if chat is a group chat
	if (!chat.groupChat)
		return next(new ErrorHandler("This is not a group chat", 400));

	// Check if current user is the creator of the group
	if (chat.creator.toString() !== req.user.toString())
		return next(
			new ErrorHandler("You are not allowed to add members", 403),
		);

	// Find user documents for all new members
	const allNewMembersPromise = members.map((i) => User.findById(i, "name"));
	const allNewMembers = await Promise.all(allNewMembersPromise);

	// Filter out members already in the chat
	const uniqueMembers = allNewMembers
		.filter((i) => !chat.members.includes(i._id.toString()))
		.map((i) => i._id);

	// Add new members to the chat
	chat.members.push(...uniqueMembers);
	await chat.save();

	// Emit event to notify chat members about the new members
	const allUsersName = allNewMembers.map((i) => i.name).join(", ");
	emitEvent(
		req,
		ALERT,
		chat.members,
		`${allUsersName} has been added in the group`,
	);
	emitEvent(req, REFETCH_CHATS, chat.members);

	// Respond with success message
	return res.status(200).json({
		success: true,
		message: "Members added successfully",
	});
});

/**
 * Remove a member from a group chat.
 */
const removeMember = TryCatch(async (req, res, next) => {
	const { userId, chatId } = req.body;

	// Find chat and user that will be removed
	const [chat, userThatWillBeRemoved] = await Promise.all([
		Chat.findById(chatId),
		User.findById(userId, "name"),
	]);

	// Check if chat exists
	if (!chat) return next(new ErrorHandler("Chat not found", 404));

	// Check if chat is a group chat
	if (!chat.groupChat)
		return next(new ErrorHandler("This is not a group chat", 400));

	// Check if current user is the creator of the group
	if (chat.creator.toString() !== req.user.toString())
		return next(
			new ErrorHandler("You are not allowed to add members", 403),
		);

	// Check if removing the member would leave the group with less than 3 members
	if (chat.members.length <= 3)
		return next(
			new ErrorHandler("Group must have at least 3 members", 400),
		);

	// Convert chat members to string IDs
	const allChatMembers = chat.members.map((i) => i.toString());

	// Remove the member from the chat
	chat.members = chat.members.filter(
		(member) => member.toString() !== userId.toString(),
	);
	await chat.save();

	// Emit event to notify chat members about the member removal
	emitEvent(req, ALERT, chat.members, {
		message: `${userThatWillBeRemoved.name} has been removed from the group`,
		chatId,
	});
	emitEvent(req, REFETCH_CHATS, allChatMembers);

	// Respond with success message
	return res.status(200).json({
		success: true,
		message: "Member removed successfully",
	});
});

/**
 * Leave a group chat.
 */
const leaveGroup = TryCatch(async (req, res, next) => {
	const chatId = req.params.id;

	// Find the chat
	const chat = await Chat.findById(chatId);

	// Check if chat exists
	if (!chat) return next(new ErrorHandler("Chat not found", 404));

	// Check if chat is a group chat
	if (!chat.groupChat)
		return next(new ErrorHandler("This is not a group chat", 400));

	// Filter out the current user from the chat members
	const remainingMembers = chat.members.filter(
		(member) => member.toString() !== req.user.toString(),
	);

	// Check if leaving would leave the group with less than 3 members
	if (remainingMembers.length < 3)
		return next(
			new ErrorHandler("Group must have at least 3 members", 400),
		);

	// If current user is the creator, randomly assign new creator from remaining members
	if (chat.creator.toString() === req.user.toString()) {
		const randomElement = Math.floor(
			Math.random() * remainingMembers.length,
		);
		const newCreator = remainingMembers[randomElement];
		chat.creator = newCreator;
	}

	// Update chat members and save
	chat.members = remainingMembers;
	await chat.save();

	// Find user document of the current user
	const [user] = await Promise.all([
		User.findById(req.user, "name"),
		chat.save(),
	]);

	// Emit event to notify chat members about the user leaving the group
	emitEvent(req, ALERT, chat.members, {
		chatId,
		message: `User ${user.name} has left the group`,
	});

	// Respond with success message
	return res.status(200).json({
		success: true,
		message: "Leave Group Successfully",
	});
});

/**
 * Send attachments to a chat.
 */
const sendAttachments = TryCatch(async (req, res, next) => {
	const { chatId } = req.body;
	const files = req.files || [];

	// Check if attachments were provided
	if (files.length < 1)
		return next(new ErrorHandler("Please Upload Attachments", 400));

	// Limit maximum number of attachments
	if (files.length > 5)
		return next(new ErrorHandler("Files Can't be more than 5", 400));

	// Find chat and current user
	const [chat, me] = await Promise.all([
		Chat.findById(chatId),
		User.findById(req.user, "name"),
	]);

	// Check if chat exists
	if (!chat) return next(new ErrorHandler("Chat not found", 404));

	// Check if attachments were provided
	if (files.length < 1)
		return next(new ErrorHandler("Please provide attachments", 400));

	// Upload attachments to cloud storage
	const attachments = await uploadFilesToCloudinary(files);

	// Create message object for database
	const messageForDB = {
		content: "",
		attachments,
		sender: me._id,
		chat: chatId,
	};

	// Create message object for real-time communication
	const messageForRealTime = {
		...messageForDB,
		sender: {
			_id: me._id,
			name: me.name,
		},
	};

	// Create message document in database
	const message = await Message.create(messageForDB);

	// Emit events to notify chat members about the new message with attachments
	emitEvent(req, NEW_MESSAGE, chat.members, {
		message: messageForRealTime,
		chatId,
	});
	emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId });

	// Respond with success message and message details
	return res.status(200).json({
		success: true,
		message,
	});
});

/**
 * Get details of a chat, optionally populating members with name and avatar.
 */
const getChatDetails = TryCatch(async (req, res, next) => {
	// Check if populate query parameter is true
	if (req.query.populate === "true") {
		// Find chat by ID and populate members with name and avatar
		const chat = await Chat.findById(req.params.id)
			.populate("members", "name avatar")
			.lean();

		// Check if chat exists
		if (!chat) return next(new ErrorHandler("Chat not found", 404));

		// Transform member objects to include only _id, name, and avatar URL
		chat.members = chat.members.map(({ _id, name, avatar }) => ({
			_id,
			name,
			avatar: avatar.url,
		}));

		// Respond with success and populated chat details
		return res.status(200).json({
			success: true,
			chat,
		});
	} else {
		// Find chat by ID without populating members
		const chat = await Chat.findById(req.params.id);

		// Check if chat exists
		if (!chat) return next(new ErrorHandler("Chat not found", 404));

		// Respond with success and chat details
		return res.status(200).json({
			success: true,
			chat,
		});
	}
});

/**
 * Rename a group chat.
 */
const renameGroup = TryCatch(async (req, res, next) => {
	const chatId = req.params.id;
	const { name } = req.body;

	// Find chat by ID
	const chat = await Chat.findById(chatId);

	// Check if chat exists
	if (!chat) return next(new ErrorHandler("Chat not found", 404));

	// Check if chat is a group chat
	if (!chat.groupChat)
		return next(new ErrorHandler("This is not a group chat", 400));

	// Check if current user is the creator of the group
	if (chat.creator.toString() !== req.user.toString())
		return next(
			new ErrorHandler("You are not allowed to rename the group", 403),
		);

	// Update chat name and save
	chat.name = name;
	await chat.save();

	// Emit event to notify chat members about the group rename
	emitEvent(req, REFETCH_CHATS, chat.members);

	// Respond with success message
	return res.status(200).json({
		success: true,
		message: "Group renamed successfully",
	});
});

/**
 * Delete a chat and associated messages and attachments.
 */
const deleteChat = TryCatch(async (req, res, next) => {
	const chatId = req.params.id;

	// Find chat by ID
	const chat = await Chat.findById(chatId);

	// Check if chat exists
	if (!chat) return next(new ErrorHandler("Chat not found", 404));

	// Save chat members for later use
	const members = chat.members;

	// Check permissions to delete the chat
	if (chat.groupChat && chat.creator.toString() !== req.user.toString())
		return next(
			new ErrorHandler("You are not allowed to delete the group", 403),
		);

	if (!chat.groupChat && !chat.members.includes(req.user.toString())) {
		return next(
			new ErrorHandler("You are not allowed to delete the chat", 403),
		);
	}

	// Find messages with attachments in the chat
	const messagesWithAttachments = await Message.find({
		chat: chatId,
		attachments: { $exists: true, $ne: [] },
	});

	// Extract public IDs of attachments for deletion from cloud storage
	const public_ids = [];
	messagesWithAttachments.forEach(({ attachments }) =>
		attachments.forEach(({ public_id }) => public_ids.push(public_id)),
	);

	// Delete messages, chat, and attachments from cloud storage
	await Promise.all([
		deletFilesFromCloudinary(public_ids), // Delete attachments from cloud storage
		chat.deleteOne(), // Delete chat document
		Message.deleteMany({ chat: chatId }), // Delete messages in the chat
	]);

	// Emit event to notify chat members about the chat deletion
	emitEvent(req, REFETCH_CHATS, members);

	// Respond with success message
	return res.status(200).json({
		success: true,
		message: "Chat deleted successfully",
	});
});

/**
 * Get messages of a chat, paginated and sorted by creation date.
 */
const getMessages = TryCatch(async (req, res, next) => {
	const chatId = req.params.id;
	const { page = 1 } = req.query;

	const resultPerPage = 20;
	const skip = (page - 1) * resultPerPage;

	// Find chat by ID
	const chat = await Chat.findById(chatId);

	// Check if chat exists
	if (!chat) return next(new ErrorHandler("Chat not found", 404));

	// Check if current user is a member of the chat
	if (!chat.members.includes(req.user.toString()))
		return next(
			new ErrorHandler("You are not allowed to access this chat", 403),
		);

	// Find messages in the chat, sorted by creation date
	const [messages, totalMessagesCount] = await Promise.all([
		Message.find({ chat: chatId })
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(resultPerPage)
			.populate("sender", "name")
			.lean(), // Populate sender information (name) from User collection
		Message.countDocuments({ chat: chatId }), // Count total number of messages
	]);

	// Calculate total number of pages for pagination
	const totalPages = Math.ceil(totalMessagesCount / resultPerPage) || 0;

	// Respond with success and messages data
	return res.status(200).json({
		success: true,
		messages: messages.reverse(), // Reverse the order to show latest messages first
		totalPages,
	});
});

// Export all the functions for use in routes
export {
	newGroupChat,
	getMyChats,
	addMembers,
	removeMember,
	leaveGroup,
	sendAttachments,
	getChatDetails,
	renameGroup,
	deleteChat,
	getMessages,
};
