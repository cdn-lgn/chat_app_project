// Importing bcrypt's compare function for password comparison
import { compare } from "bcrypt";

// Importing event constants and helper functions
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";

// Importing error handling middleware and database models
import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { Request } from "../models/request.js";
import { User } from "../models/user.js";

// Importing utility functions for cookies, events, file uploads, and error handling
import {
    cookieOptions,
    emitEvent,
    sendToken,
    uploadFilesToCloudinary,
} from "../utils/features.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// Middleware function to create a new user and save it to the database, also saves token in cookie
const newUser = TryCatch(async (req, res, next) => {
    const { name, username, password, bio } = req.body;

    const file = req.file;

    // Checking if avatar file is uploaded
    if (!file) return next(new ErrorHandler("Please Upload Avatar"));

    // Uploading avatar file to Cloudinary and getting result
    const result = await uploadFilesToCloudinary([file]);

    // Creating avatar object with public_id and URL
    const avatar = {
        public_id: result[0].public_id,
        url: result[0].url,
    };

    // Creating new user in database
    const user = await User.create({
        name,
        bio,
        username,
        password,
        avatar,
    });

    // Sending token in cookie and response status
    sendToken(res, user, 201, "User created");
});

// Middleware function to login user and save token in cookie
const login = TryCatch(async (req, res, next) => {
    const { username, password } = req.body;

    // Finding user by username and selecting password field
    const user = await User.findOne({ username }).select("+password");

    // Handling case if user not found
    if (!user)
        return next(new ErrorHandler("Invalid Username or Password", 404));

    // Comparing provided password with stored password hash
    const isMatch = await compare(password, user.password);

    // Handling case if passwords do not match
    if (!isMatch)
        return next(new ErrorHandler("Invalid Username or Password", 404));

    // Sending token in cookie and welcoming message
    sendToken(res, user, 200, `Welcome Back, ${user.name}`);
});

// Middleware function to get logged-in user's profile
const getMyProfile = TryCatch(async (req, res, next) => {
    // Finding user by ID from request
    const user = await User.findById(req.user);

    // Handling case if user not found
    if (!user) return next(new ErrorHandler("User not found", 404));

    // Sending user profile in response
    res.status(200).json({
        success: true,
        user,
    });
});

// Middleware function to logout user by clearing token cookie
const logout = TryCatch(async (req, res) => {
    // Clearing token cookie and sending logout success message
    return res
        .status(200)
        .cookie("userToken", "", { ...cookieOptions, maxAge: 0 })
        .json({
            success: true,
            message: "Logged out successfully",
        });
});

// Middleware function to search users by name
const searchUser = TryCatch(async (req, res) => {
    const { name = "" } = req.query;

    // Finding all chats where current user is a member
    const myChats = await Chat.find({ groupChat: false, members: req.user });

    // Extracting all unique users from my chats (friends or people I have chatted with)
    const allUsersFromMyChats = myChats.flatMap((chat) => chat.members);

    // Finding all users except current user and their friends
    const allUsersExceptMeAndFriends = await User.find({
        _id: { $nin: allUsersFromMyChats },
        name: { $regex: name, $options: "i" },
    });

    // Modifying response to include only necessary user details
    const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
        _id,
        name,
        avatar: avatar.url,
    }));

    // Sending found users in response
    return res.status(200).json({
        success: true,
        users,
    });
});

// Middleware function to send friend request to another user
const sendFriendRequest = TryCatch(async (req, res, next) => {
    const { userId } = req.body;

    // Checking if request already exists between users
    const request = await Request.findOne({
        $or: [
            { sender: req.user, receiver: userId },
            { sender: userId, receiver: req.user },
        ],
    });

    // Handling case if request already exists
    if (request) return next(new ErrorHandler("Request already sent", 400));

    // Creating new friend request in database
    await Request.create({
        sender: req.user,
        receiver: userId,
    });

    // Emitting new request event to involved user
    emitEvent(req, NEW_REQUEST, [userId]);

    // Sending success message in response
    return res.status(200).json({
        success: true,
        message: "Friend Request Sent",
    });
});

// Middleware function to accept or reject friend request
const acceptFriendRequest = TryCatch(async (req, res, next) => {
    const { requestId, accept } = req.body;

    // Finding friend request by ID and populating sender and receiver details
    const request = await Request.findById(requestId)
        .populate("sender", "name")
        .populate("receiver", "name");

    // Handling case if request not found
    if (!request) return next(new ErrorHandler("Request not found", 404));

    // Checking if current user is authorized to accept request
    if (request.receiver._id.toString() !== req.user.toString())
        return next(
            new ErrorHandler(
                "You are not authorized to accept this request",
                401,
            ),
        );

    // Handling case if request is rejected
    if (!accept) {
        await request.deleteOne();

        // Sending success message for rejected request
        return res.status(200).json({
            success: true,
            message: "Friend Request Rejected",
        });
    }

    // Creating new chat between sender and receiver as friends
    const members = [request.sender._id, request.receiver._id];
    await Chat.create({
        members,
        name: `${request.sender.name}-${request.receiver.name}`,
    });

    // Deleting friend request from database after acceptance
    await request.deleteOne();

    // Emitting event to refresh chats for involved members
    emitEvent(req, REFETCH_CHATS, members);

    // Sending success message for accepted request along with sender ID
    return res.status(200).json({
        success: true,
        message: "Friend Request Accepted",
        senderId: request.sender._id,
    });
});

// Middleware function to get notifications (friend requests) for current user
const getMyNotifications = TryCatch(async (req, res) => {
    // Finding all friend requests received by current user
    const requests = await Request.find({ receiver: req.user }).populate(
        "sender",
        "name avatar",
    );

    // Modifying requests to include only necessary sender details
    const allRequests = requests.map(({ _id, sender }) => ({
        _id,
        sender: {
            _id: sender._id,
            name: sender.name,
            avatar: sender.avatar.url,
        },
    }));

    // Sending all friend requests in response
    return res.status(200).json({
        success: true,
        allRequests,
    });
});

// Middleware function to get all friends of current user
const getMyFriends = TryCatch(async (req, res) => {
    const chatId = req.query.chatId;

    // Finding all chats where current user is a member (individual chats)
    const chats = await Chat.find({
        members: req.user,
        groupChat: false,
    }).populate("members", "name avatar");

    // Extracting friends (other members in chats) from chats
    const friends = chats.map(({ members }) => {
        const otherUser = getOtherMember(members, req.user);

        return {
            _id: otherUser._id,
            name: otherUser.name,
            avatar: otherUser.avatar.url,
        };
    });

    // Handling case if chat ID is provided (filtering available friends)
    if (chatId) {
        const chat = await Chat.findById(chatId);

        const availableFriends = friends.filter(
            (friend) => !chat.members.includes(friend._id),
        );

        // Sending filtered friends in response
        return res.status(200).json({
            success: true,
            friends: availableFriends,
        });
    } else {
        // Sending all friends in response
        return res.status(200).json({
            success: true,
            friends,
        });
    }
});

// Exporting middleware functions for use in routes
export {
    acceptFriendRequest,
    getMyFriends,
    getMyNotifications,
    getMyProfile,
    login,
    logout,
    newUser,
    searchUser,
    sendFriendRequest,
};
