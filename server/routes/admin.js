const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const isAdmin = require("../middleware/isAdmin");
const User = require("../models/User");

const router = express.Router();

// GET /admin/users — list all users
router.get("/users", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    return res.json({ users });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch users", error });
  }
});

// POST /admin/users — create a new user (admin only)
router.post("/users", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { username, password, displayName, email, isAdmin: newUserIsAdmin } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Create new user
    const user = await User.create({
      username,
      password,
      displayName: displayName || "",
      email: email || "",
      isAdmin: newUserIsAdmin || false,
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json({ user: userResponse, message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create user", error });
  }
});

// PATCH /admin/users/:id — update user
router.patch("/users/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { displayName, email, isAdmin: isAdminUpdate } = req.body;

    // Prevent admin from updating themselves to non-admin
    if (String(req.user._id) === String(id) && isAdminUpdate === false) {
      return res.status(400).json({ message: "You cannot remove your own admin privileges" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (displayName !== undefined) user.displayName = displayName;
    if (email !== undefined) user.email = email;
    if (isAdminUpdate !== undefined) user.isAdmin = isAdminUpdate;

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.json({ user: userResponse });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update user", error });
  }
});

// PATCH /admin/users/:id/block — toggle block status
router.patch("/users/:id/block", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from blocking themselves
    if (String(req.user._id) === String(id)) {
      return res.status(400).json({ message: "You cannot block yourself" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.json({ user: userResponse });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update user", error });
  }
});

// DELETE /admin/users/:id — delete user
router.delete("/users/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (String(req.user._id) === String(id)) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete user", error });
  }
});

module.exports = router;
