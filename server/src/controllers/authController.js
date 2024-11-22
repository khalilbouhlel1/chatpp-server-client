import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";

const registerUser = async (req, res) => {
  try {
    const { email, fullname, password } = req.body;

    // Input validation
    if (!email || !fullname || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      fullname,
      password: hashedPassword,
    });

    const token = generateToken(newUser._id, res);

    return res.status(201).json({
      message: "User created successfully",
      user: { email, fullname, profilepic: newUser.profilepic },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      message: "Server error during registration",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !( bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    
    // Set the token in a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        email: user.email,
        fullname: user.fullname,
        profilepic: user.profilepic
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    return res.status(200).json({ 
      success: true,
      message: "Logout successful" 
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during logout",
      error: error.message
    });
  }
};

const checkAuth = async (req, res) => {
 try{
  return res.status(200).json({ user: req.user });
 }catch(error){
  return res.status(500).json({ message: "Server error during checkAuth" });
 }
};

export { registerUser, loginUser, logoutUser, checkAuth };
