const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const isAdmin = require("../middleware/isAdmin");
const User = require("../models/User");

const router = express.Router();

// GET /admin/users — list all users
router.get("/users", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "-googleId").sort({ createdAt: -1 });
    return res.json({ users });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch users", error });
  }
});

// PATCH /admin/users/:id/block — toggle block status
router.patch("/users/:id/block", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from blocking themselves
    if (String(req.user._id) === String(id)) {
      return res.status(400).json({ message: "You cannot block yourself." });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update user", error });
  }
});

module.exports = router;
