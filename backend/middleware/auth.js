import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  try {
    // Get the token from the cookie
    const token = req.cookies.authToken;

    // If no token is provided, deny access
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token.' });
      }

      // Attach the decoded user ID to the request object
      req.userId = decoded.userId;

      // Proceed to the next middleware/route
      next();
    });
  } catch (error) {
    console.error('Token authentication failed:', error.message);
    res.status(500).json({ message: 'Internal server error.' });
  }
}
