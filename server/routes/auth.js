const express = require("express");
const passport = require("passport");
const User = require("../models/User");

const router = express.Router();
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

router.post("/login", passport.authenticate("local"), (req, res) => {
  if (req.user) {
    const { _id, displayName, email, username, isAdmin, isBlocked, createdAt } = req.user;
    return res.json({
      user: { _id, displayName, email, username, isAdmin, isBlocked, createdAt },
    });
  }
  return res.status(401).json({ message: "Login failed" });
});

router.get("/logout", (req, res, next) => {
  req.logout((logoutError) => {
    if (logoutError) {
      return next(logoutError);
    }

    req.session.destroy((sessionError) => {
      if (sessionError) {
        return next(sessionError);
      }
      // Clear cookie with same options as used for setting it so browsers remove it correctly
      res.clearCookie("connect.sid", {
        path: "/",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
      });
      return res.redirect(CLIENT_URL);
    });
  });
});

router.get("/me", (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    const { _id, displayName, email, username, isAdmin, isBlocked, createdAt } = req.user;
    return res.json({
      user: { _id, displayName, email, username, isAdmin, isBlocked, createdAt },
    });
  }
  return res.status(401).json({ message: "Unauthorized" });
});

module.exports = router;
