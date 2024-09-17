import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./utils/DBConnection.js";
import { errorMiddleWare } from "./middlewares/error.js";
import userRoute from "./routes/user.js";
// import chatRoute from "./routes/chat.js";
// import adminRoute from "./routes/admin.js";
import { corsOptions } from "./constants/config.js";

dotenv.config({
   path: ".env",
});

const port = process.env.PORT || 5000;
const envMode = process.env.NODE_ENV || "PRODUCTION";
const adminSecretKey = process.env.ADMIN_SECRET_KEY || "adsasddfsdfsdfd";
const userSocketIDs = new Map();
const onlineUsers = new Set();

connectDB(process.env.MONGO_URI);

const app = express();

const server = createServer(app);
const io = new Server({
   cors: corsOptions,
});

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use("/api/v1/user", userRoute);
// app.use("/api/v1/chat", chatRoute);
// app.use("/api/v1/admin", adminRoute);

app.get("/", (req, res) => {
   console.log(process.env.MONGO_URI);
   res.send("hello world, home page :)");
});

// io.use((socket, next) => {
//   cookieParser()(
//     socket.request,
//     socket.request.res,
//     async (err) => await socketAuthenticator(err, socket, next)
//   );
// });

// io.on("connection", (socket) => {
//   const user = socket.user;
//   userSocketIDs.set(user._id.toString(), socket.id);

//   socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
//     const messageForRealTime = {
//       content: message,
//       _id: uuid(),
//       sender: {
//         _id: user._id,
//         name: user.name,
//       },
//       chat: chatId,
//       createdAt: new Date().toISOString(),
//     };

//     const messageForDB = {
//       content: message,
//       sender: user._id,
//       chat: chatId,
//     };

//     const membersSocket = getSockets(members);
//     io.to(membersSocket).emit(NEW_MESSAGE, {
//       chatId,
//       message: messageForRealTime,
//     });
//     io.to(membersSocket).emit(NEW_MESSAGE_ALERT, { chatId });

//     try {
//       await Message.create(messageForDB);
//     } catch (error) {
//       throw new Error(error);
//     }
//   });

//   socket.on(START_TYPING, ({ members, chatId }) => {
//     const membersSockets = getSockets(members);
//     socket.to(membersSockets).emit(START_TYPING, { chatId });
//   });

//   socket.on(STOP_TYPING, ({ members, chatId }) => {
//     const membersSockets = getSockets(members);
//     socket.to(membersSockets).emit(STOP_TYPING, { chatId });
//   });

//   socket.on(CHAT_JOINED, ({ userId, members }) => {
//     onlineUsers.add(userId.toString());

//     const membersSocket = getSockets(members);
//     io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
//   });

//   socket.on(CHAT_LEAVED, ({ userId, members }) => {
//     onlineUsers.delete(userId.toString());

//     const membersSocket = getSockets(members);
//     io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
//   });

//   socket.on("disconnect", () => {
//     userSocketIDs.delete(user._id.toString());
//     onlineUsers.delete(user._id.toString());
//     socket.broadcast.emit(ONLINE_USERS, Array.from(onlineUsers));
//   });
// });

app.use(errorMiddleWare);

server.listen(port, () => {
   console.log(`Server is running on port ${port} in ${envMode} Mode`);
});

export { envMode, adminSecretKey, userSocketIDs };
