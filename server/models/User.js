const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  displayName: { type: String, default: "" },
  email: { type: String, default: "" },
  googleId: { type: String, sparse: true, unique: true },
  isAdmin: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving (Mongoose 9: async hooks must not use next())
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model("User", userSchema);
