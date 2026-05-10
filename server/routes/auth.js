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
  (req, res) => {
    // Ensure session is saved before redirecting so the cookie is set in the response
    // (important when redirecting across domains / behind proxies)
    if (req.session) {
      req.session.save((err) => {
        if (err) {
          console.error('Failed to save session after OAuth callback:', err);
          return res.redirect(`${CLIENT_URL}/?error=session_save`);
        }
        return res.redirect(`${CLIENT_URL}/categories`);
      });
    } else {
      return res.redirect(`${CLIENT_URL}/categories`);
    }
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
      // Clear cookie with same options as used for setting it so browsers remove it correctly
      res.clearCookie("connect.sid", {
        path: '/',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
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
