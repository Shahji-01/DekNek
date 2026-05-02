import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name must be at most 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // 2FA fields
    twoFASecret: {
      type: String,
      select: false, // Never expose the TOTP seed
    },
    twoFAEnabled: {
      type: Boolean,
      default: false,
    },
    // Password reset flow
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare plain password with hashed
userSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate main JWT
userSchema.methods.generatejwtToken = async function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || "default_secret_change_me",
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
};

// Generate a short-lived temp token (used for 2FA step)
userSchema.methods.generateTempToken = function () {
  const unHashToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(unHashToken).digest("hex");
  const tokenExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 min
  return { unHashToken, hashedToken, tokenExpire };
};

const Users = mongoose.model("Users", userSchema);
export default Users;
