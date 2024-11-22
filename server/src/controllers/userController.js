import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { uploadToCloudinary } from '../lib/cloudinary.js';

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error while fetching profile" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { fullname, password } = req.body;
    let profilepic;
    
    console.log('Update Profile Request:', {
      body: req.body,
      file: req.file ? {
        mimetype: req.file.mimetype,
        size: req.file.size
      } : null
    });
    
    // Handle file upload from multer
    if (req.file) {
      profilepic = {
        buffer: req.file.buffer,
        mimetype: req.file.mimetype
      };
      console.log('Processing file upload:', {
        mimetype: req.file.mimetype,
        size: req.file.size
      });
    } else if (req.body.profilepic && typeof req.body.profilepic === 'string') {
      profilepic = req.body.profilepic;
      console.log('Processing base64 image');
    }
    
    // Find user first
    const user = await User.findById(req.user.id);
    console.log('Current user data:', {
      id: user._id,
      fullname: user.fullname,
      hasProfilePic: !!user.profilepic
    });

    const updateFields = {};
    
    if (fullname) {
      updateFields.fullname = fullname;
    }
    
    if (profilepic) {
      try {
        console.log('Attempting to upload to Cloudinary...');
        const imageUrl = await uploadToCloudinary(profilepic);
        console.log('Cloudinary upload successful:', imageUrl);
        updateFields.profilepic = imageUrl;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(400).json({ 
          success: false,
          message: "Error uploading profile picture" 
        });
      }
    }
    
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true }
    ).select("-password");

    console.log('Profile update successful:', {
      id: updatedUser._id,
      fullname: updatedUser.fullname,
      hasProfilePic: !!updatedUser.profilepic
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error while updating profile",
      error: error.message 
    });
  }
};

export { getUserProfile, updateUserProfile };
