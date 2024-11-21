const SECRET_KEY = process.env.SECRET_KEY;
import jwt from 'jsonwebtoken'

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; 

  if (!token) {
    return res.status(401).json({ error: "Access token is missing" });
  }

  try {
    const user = jwt.verify(token, SECRET_KEY);
    req.user = user; 
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};