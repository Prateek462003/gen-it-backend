import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(403).json("Access denied, token missing!");
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json("Invalid token");
  }
};

export { verifyToken };
