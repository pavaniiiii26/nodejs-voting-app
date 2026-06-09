import jwt from 'jsonwebtoken';

// Middleware to verify JWT token
const jwtAuthMiddleware = (req, res, next) => {
  const authorization = req.headers['authorization'];

  if (!authorization) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h'
    }
  );
};

export { jwtAuthMiddleware, generateToken };