require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");

const authRoutes = require("./routes/auth");
const quizRoutes = require("./routes/quiz");
require("./config/passport");

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "change_this_secret",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/auth", authRoutes);
app.use("/api", quizRoutes);

async function startServer() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/quizapp",
    );
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    if (error?.syscall === "querySrv" || error?.syscall === "queryA") {
      console.error(
        "DNS lookup failed. If you use mongodb+srv://, try switching DNS/disable DNS filtering (VPN/AdGuard/AV) or use a standard mongodb:// connection string (host1,host2,host3).",
      );
    }
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
