import jwt from 'jsonwebtoken';
import { accessTokenSecrete } from '../../core/config/config.js';
import RoleType from '../../lib/types.js';
import { generateResponse } from '../../lib/responseFormate.js';
import User from '../../entities/auth/auth.model.js';

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) generateResponse(res, 401, false, 'No token, auth denied', null);

  try {
    const decoded = jwt.verify(token, accessTokenSecrete);
    const user = await User.findById(decoded._id).select('-password -createdAt -updatedAt -__v');
    req.user = user;
    next();
  }

  catch (err) {
    if (err.name === "TokenExpiredError") {
      generateResponse(res, 401, false, 'Token expired', null);
    }

    else if (err.name === "JsonWebTokenError") {
      generateResponse(res, 401, false, 'Token is not valid', null);
    }

    else if (err.name === "NotBeforeError") {
      generateResponse(res, 401, false, 'Token not active', null);
    }

    else {
      next(err)
    }
  }
};

const userMiddleware = (req, res, next) => {
  if (!req.user) {
    return generateResponse(res, 401, false, 'Unauthorized: User not found', null);
  }
  const { role } = req.user;

  if (role !== "USER") {
    generateResponse(res, 403, false, 'User access only', null);
  }

  next();
};

const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return generateResponse(res, 401, false, 'Unauthorized: Admin not found', null);
  }
  const { role } = req.user;

  if (role !== "ADMIN") {
    generateResponse(res, 403, false, 'Admin access only', null);
  }

  next();
};

const lenderMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, auth denied' });

  try {
    const decoded = jwt.verify(token, accessTokenSecrete);
    req.user = decoded;

    if (req.user.role !== RoleType.LENDER) {
      return res.status(403).json({ message: 'Lender access only' });
    }

    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};


const userAdminSellerMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, auth denied' });

  try {
    const decoded = jwt.verify(token, accessTokenSecrete);
    req.user = decoded;

    const roles = [RoleType.USER, RoleType.ADMIN, RoleType.LENDER];
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'User, Admin or Lender access only' });
    }

    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export {
  userMiddleware,
  adminMiddleware,
  lenderMiddleware,
  userAdminSellerMiddleware,
};
