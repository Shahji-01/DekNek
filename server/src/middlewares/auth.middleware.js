import jwt from "jsonwebtoken";
import Users from "../models/user.model.js";
import appError from "../utils/appError.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";

export const auth = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new appError(401, "Unauthorized: No token provided");
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new appError(401, "Token expired or invalid");
  }

  const user = await Users.findById(decodedToken.id);

  if (!user) {
    throw new appError(401, "User no longer exists");
  }

  req.id = decodedToken.id;
  req.user = user;
  next();
});
