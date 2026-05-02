import Joi from "joi";

const validationOptions = {
  abortEarly: false,
  stripUnknown: true,
  errors: { wrap: { label: "" } },
};

const formatJoiErrors = (error) =>
  error.details.map((detail) => ({
    field: detail.path.join("."),
    message: detail.message,
  }));

const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property] || {}, validationOptions);
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: "Validation failed",
        errors: formatJoiErrors(error),
      });
    }
    req[property] = value;
    next();
  };
};

// ─── Auth Schemas ─────────────────────────────────────────────────────────────
const signUpSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
  }),
  email: Joi.string().email().lowercase().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email address",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required().messages({
    "string.empty": "Email is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().lowercase().required().messages({
    "string.email": "Please provide a valid email address",
  }),
});

const resetPasswordSchema = Joi.object({
  newPassword: Joi.string().min(6).required().messages({
    "string.min": "New password must be at least 6 characters",
  }),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "string.empty": "Current password is required",
  }),
  newPassword: Joi.string().min(6).required().messages({
    "string.min": "New password must be at least 6 characters",
  }),
});

const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
  }),
});

const deleteAccountSchema = Joi.object({
  password: Joi.string().required().messages({
    "string.empty": "Password is required to delete your account",
  }),
});

const otpSchema = Joi.object({
  code: Joi.string().length(6).pattern(/^\d+$/).required().messages({
    "string.length": "OTP must be exactly 6 digits",
    "string.pattern.base": "OTP must contain only digits",
  }),
});

export const validateUserSignup = validate(signUpSchema);
export const validateUserLogin = validate(loginSchema);
export const validateForgotPassword = validate(forgotPasswordSchema);
export const validateResetPassword = validate(resetPasswordSchema);
export const validateChangePassword = validate(changePasswordSchema);
export const validateUpdateProfile = validate(updateProfileSchema);
export const validateDeleteAccount = validate(deleteAccountSchema);
export const validateOTP = validate(otpSchema);
