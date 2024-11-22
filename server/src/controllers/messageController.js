import User from "../models/User.js";
import Message from "../models/Message.js";
import cloudinary from "cloudinary";
import { io, getReceiverSocketId } from "../lib/socket.js";

const getUserforChat = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { Id: userTochatId } = req.params;
    const senderId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId, receiverId: userTochatId },
        { senderId: userTochatId, receiverId: senderId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const createMessage = async (req, res) => {
  try {
    const { Id: receiverId } = req.params;
    const senderId = req.user._id;
    const { text, image } = req.body;

    if (!text && !image) {
      return res.status(400).json({ message: "Message content is required" });
    }

    let imageUrl;
    if (image) {
      try {
        const uploadedResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadedResponse.secure_url;
      } catch (uploadError) {
        console.error("Image upload error:", uploadError);
        return res.status(400).json({ message: "Failed to upload image" });
      }
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // Socket emission
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Message creation error:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};

export { getUserforChat, getMessages, createMessage };
