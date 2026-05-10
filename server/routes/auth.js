const express = require("express");
const passport = require("passport");

const router = express.Router();
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${CLIENT_URL}/?blocked=1`,
  }),
  (_req, res) => {
    res.redirect(`${CLIENT_URL}/categories`);
  },
);

router.get("/logout", (req, res, next) => {
  req.logout((logoutError) => {
    if (logoutError) {
      return next(logoutError);
    }

    req.session.destroy((sessionError) => {
      if (sessionError) {
        return next(sessionError);
      }
      res.clearCookie("connect.sid");
      return res.redirect(CLIENT_URL);
    });
  });
});

router.get("/me", (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    const { _id, displayName, email, photo, isAdmin, isBlocked, createdAt } = req.user;
    return res.json({ user: { _id, displayName, email, photo, isAdmin, isBlocked, createdAt } });
  }
  return res.status(401).json({ message: "Unauthorized" });
});

module.exports = router;
