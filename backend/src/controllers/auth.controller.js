import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { email, fullName, password } = req.body;
    if (!email || !fullName || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      email: email,
      fullName: fullName,
      password: hashedPassword,
    });
    if (newUser) {
      generateToken(newUser._id, res);
      const savedUser = await newUser.save();
      res.status(201).json({
        _id: savedUser._id,
        email: savedUser.email,
        fullName: savedUser.fullName,
        profilePic: savedUser.profilePic,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = (req, res) => {
  res.send("This is login route");
};

export const logout = (req, res) => {
  res.send("This is logout route");
};
