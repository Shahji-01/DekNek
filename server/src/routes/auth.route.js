import express from "express";
import {
  signUp,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  deleteAccount,
  setup2FA,
  verify2FA,
  disable2FA,
  verifyLogin2FA,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import {
  validateUserSignup,
  validateUserLogin,
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword,
  validateUpdateProfile,
  validateDeleteAccount,
  validateOTP,
} from "../validators/index.validator.js";

const router = express.Router();

// ─── Public Auth Routes ───────────────────────────────────────────────────────
router.post("/signup", validateUserSignup, signUp);
router.post("/login", validateUserLogin, login);
router.post("/login/verify-2fa", verifyLogin2FA); // Uses temp JWT in header
router.post("/logout", logout);

// ─── Password Reset (public, token-based) ────────────────────────────────────
router.post("/forgot-password", validateForgotPassword, forgotPassword);
router.post("/reset-password/:token", validateResetPassword, resetPassword);

// ─── Protected User Routes ────────────────────────────────────────────────────
router.get("/me", auth, getMe);
router.patch("/update-profile", auth, validateUpdateProfile, updateProfile);
router.patch("/change-password", auth, validateChangePassword, changePassword);
router.delete("/delete-account", auth, validateDeleteAccount, deleteAccount);

// ─── 2FA Routes (all protected) ──────────────────────────────────────────────
router.post("/setup-2fa", auth, setup2FA);
router.post("/verify-2fa", auth, validateOTP, verify2FA);
router.post("/disable-2fa", auth, validateOTP, disable2FA);

export default router;
