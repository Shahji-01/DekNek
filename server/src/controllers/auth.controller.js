import asyncHandler from "../utils/asyncHandler.utils.js";
import appResponse from "../utils/appResponse.utils.js";
import appError from "../utils/appError.utils.js";
import Users from "../models/user.model.js";
import sendMail from "../services/email.service.js";
import { welcomeEmailHtml, welcomeEmailPlainText } from "../template/welcomeEmail.template.js";
import { resetPasswordHtml, resetPasswordPlainText } from "../template/resetPassword.template.js";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import jwt from "jsonwebtoken";
import logger from "../utils/logger.utils.js";
import crypto from "node:crypto";

// ─── Shared Cookie Options ────────────────────────────────────────────────────
const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
  maxAge: 1000 * 60 * 60 * 24, // 1 day
};

const clearCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
  expires: new Date(0),
};

// ─── Helper: strip all sensitive fields ───────────────────────────────────────
const sanitizeUser = (user) => {
  const obj = typeof user.toObject === "function" ? user.toObject() : { ...user };
  delete obj.password;
  delete obj.twoFASecret;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  return obj;
};

// ─── POST /api/auth/signup ────────────────────────────────────────────────────
export const signUp = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await Users.findOne({ email });
  if (existing) {
    throw new appError(400, "User already exists");
  }

  const newUser = new Users({ name, email, password });
  await newUser.save();

  const data = sanitizeUser(newUser);

  // Send welcome email (non-blocking)
  try {
    await sendMail({
      email,
      subject: "Welcome to TaskMaster Pro",
      text: welcomeEmailPlainText(name),
      html: welcomeEmailHtml(name),
    });
  } catch (mailErr) {
    logger.error(`Welcome email failed for ${email}: ${mailErr.message}`);
  }

  let responseMessage = "User signed up successfully";
  if (process.env.NODEMAILER_HOST === "sandbox.smtp.mailtrap.io") {
    responseMessage += ". Note: Using Mailtrap for emails. Check your Mailtrap inbox.";
  }

  return res.status(201).json(new appResponse(201, { user: data }, responseMessage));
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await Users.findOne({ email }).select("+password");
  if (!user) throw new appError(401, "Invalid credentials");

  const passwordMatch = await user.checkPassword(password);
  if (!passwordMatch) throw new appError(401, "Invalid credentials");

  // If 2FA is enabled, issue a short-lived temp token instead of full JWT
  if (user.twoFAEnabled) {
    const tempToken = jwt.sign(
      { id: user._id, twoFA: true },
      process.env.JWT_SECRET_TEMP,
      { expiresIn: process.env.JWT_EXPIRES_IN_TEMP || "5m" }
    );
    return res.status(200).json(
      new appResponse(200, { twoFARequired: true, tempToken }, "2FA verification required")
    );
  }

  const token = await user.generatejwtToken();
  const data = sanitizeUser(user);

  return res.status(200).json(new appResponse(200, { user: data, token }, "Logged in successfully"));
});

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
export const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", clearCookieOptions);
  return res.status(200).json(new appResponse(200, null, "Logged out successfully"));
});

// ─── GET /api/users/me ────────────────────────────────────────────────────────
export const getMe = asyncHandler(async (req, res) => {
  const data = sanitizeUser(req.user);
  return res.status(200).json(new appResponse(200, { user: data }, "User profile fetched"));
});

// ─── PATCH /api/users/update-profile ─────────────────────────────────────────
export const updateProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const user = await Users.findByIdAndUpdate(
    req.id,
    { name: name.trim() },
    { new: true, runValidators: true }
  ).select("-password -twoFASecret -passwordResetToken -passwordResetExpires");

  if (!user) throw new appError(404, "User not found");

  return res.status(200).json(new appResponse(200, { user }, "Profile updated successfully"));
});

// ─── PATCH /api/users/change-password ────────────────────────────────────────
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await Users.findById(req.id).select("+password");
  if (!user) throw new appError(404, "User not found");

  const passwordMatch = await user.checkPassword(currentPassword);
  if (!passwordMatch) throw new appError(401, "Current password is incorrect");

  if (currentPassword === newPassword) {
    throw new appError(400, "New password must be different from current password");
  }

  user.password = newPassword;
  await user.save();

  return res.status(200).json(new appResponse(200, null, "Password changed successfully"));
});

// ─── DELETE /api/users/delete-account ────────────────────────────────────────
export const deleteAccount = asyncHandler(async (req, res) => {
  const { password } = req.body;

  const user = await Users.findById(req.id).select("+password");
  if (!user) throw new appError(404, "User not found");

  const passwordMatch = await user.checkPassword(password);
  if (!passwordMatch) throw new appError(401, "Password is incorrect");

  await Users.findByIdAndDelete(req.id);
  res.cookie("token", "", clearCookieOptions);

  return res.status(200).json(new appResponse(200, null, "Account deleted successfully"));
});

// ═══════════════════════════════════════════════════════════════════════════════
// 2FA CONTROLLERS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── POST /api/users/setup-2fa ────────────────────────────────────────────────
export const setup2FA = asyncHandler(async (req, res) => {
  const user = await Users.findById(req.id);
  if (!user) throw new appError(404, "User not found");

  if (user.twoFAEnabled) {
    throw new appError(400, "2FA is already enabled. Disable it first before re-configuring.");
  }

  const secret = speakeasy.generateSecret({
    name: `TaskMaster Pro (${user.email})`,
    length: 32,
  });

  user.twoFASecret = secret.base32;
  await user.save();

  const qrCode = await QRCode.toDataURL(secret.otpauth_url);

  return res.status(200).json(
    new appResponse(200, { qrCode, message: "Scan QR code in your authenticator app, then call /verify-2fa to activate." })
  );
});

// ─── POST /api/users/verify-2fa ───────────────────────────────────────────────
export const verify2FA = asyncHandler(async (req, res) => {
  const { code } = req.body;

  const user = await Users.findById(req.id).select("+twoFASecret");
  if (!user) throw new appError(404, "User not found");
  if (!user.twoFASecret) throw new appError(400, "2FA setup not started. Call /setup-2fa first.");

  const isValid = speakeasy.totp.verify({
    secret: user.twoFASecret,
    encoding: "base32",
    token: code,
    window: 1,
  });

  if (!isValid) throw new appError(400, "Invalid OTP code");

  user.twoFAEnabled = true;
  await user.save();

  return res.status(200).json(new appResponse(200, null, "2FA enabled successfully"));
});

// ─── POST /api/users/disable-2fa ─────────────────────────────────────────────
export const disable2FA = asyncHandler(async (req, res) => {
  const { code } = req.body;

  const user = await Users.findById(req.id).select("+twoFASecret");
  if (!user) throw new appError(404, "User not found");
  if (!user.twoFAEnabled) throw new appError(400, "2FA is not enabled on this account");

  const isValid = speakeasy.totp.verify({
    secret: user.twoFASecret,
    encoding: "base32",
    token: code,
    window: 1,
  });

  if (!isValid) throw new appError(400, "Invalid OTP — cannot disable 2FA");

  user.twoFAEnabled = false;
  user.twoFASecret = undefined;
  await user.save();

  return res.status(200).json(new appResponse(200, null, "2FA disabled successfully"));
});

// ─── POST /api/auth/login/verify-2fa (step 2 of 2FA login) ───────────────────
export const verifyLogin2FA = asyncHandler(async (req, res) => {
  const { code } = req.body;

  const tempToken = req.headers.authorization?.split(" ")[1];
  if (!tempToken) throw new appError(401, "Unauthorized — no temp token provided");

  let decoded;
  try {
    decoded = jwt.verify(tempToken, process.env.JWT_SECRET_TEMP);
  } catch (err) {
    throw new appError(401, "Temp token expired or invalid");
  }

  const user = await Users.findById(decoded.id).select("+twoFASecret");
  if (!user || !user.twoFAEnabled) throw new appError(400, "2FA is not enabled for this account");

  const isValid = speakeasy.totp.verify({
    secret: user.twoFASecret,
    encoding: "base32",
    token: code,
    window: 1,
  });

  if (!isValid) throw new appError(400, "Invalid OTP code");

  const token = await user.generatejwtToken();

  return res.status(200).json(
    new appResponse(200, { token }, "Logged in successfully with 2FA")
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// PASSWORD RESET CONTROLLERS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── POST /api/auth/forgot-password ──────────────────────────────────────────
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await Users.findOne({ email });

  // Always return the same message to avoid email enumeration attacks
  if (!user) {
    return res.status(200).json(
      new appResponse(200, null, "If that email is registered, a reset link has been sent.")
    );
  }

  const { unHashToken, hashedToken, tokenExpire } = user.generateTempToken();
  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = tokenExpire;
  await user.save({ validateBeforeSave: false });

  const resetLink = `${process.env.CLIENT_URL}/reset-password/${unHashToken}`;

  try {
    await sendMail({
      email,
      subject: "TaskMaster Pro — Password Reset Request",
      text: resetPasswordPlainText(user.name, resetLink),
      html: resetPasswordHtml(user.name, resetLink),
    });
  } catch (mailErr) {
    // Roll back token if email fails so user can retry
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    logger.error(`Password reset email failed for ${email}: ${mailErr.message}`);
    throw new appError(500, "Failed to send reset email. Please try again.");
  }

  let responseMessage = "If that email is registered, a reset link has been sent.";
  if (process.env.NODEMAILER_HOST === "sandbox.smtp.mailtrap.io") {
    responseMessage += " Note: Using Mailtrap for emails. Check your Mailtrap inbox.";
  }

  return res.status(200).json(
    new appResponse(200, null, responseMessage)
  );
});

// ─── POST /api/auth/reset-password/:token ────────────────────────────────────
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await Users.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  }).select("+password +passwordResetToken +passwordResetExpires");

  if (!user) throw new appError(400, "Reset link is invalid or has expired");

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return res.status(200).json(
    new appResponse(200, null, "Password reset successfully. You can now log in with your new password.")
  );
});
