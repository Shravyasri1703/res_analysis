// src/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
  // Get auth header
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  // Extract token
  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: "Token missing" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};