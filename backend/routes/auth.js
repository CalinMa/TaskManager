import express from 'express';
import { login, verifyTwoFactorCode } from '../services/auth.js';

export function authRoutes(app) {
  const router = express.Router();

  // Login Route
  router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const result = await login(username, password);
      res.status(200).json({ message: '2FA code sent', ...result });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  });

// Verify 2FA Route with cookies
router.post('/verify-2fa', async (req, res) => {
  try {
    const { userId, twoFactorCode } = req.body;

    // Verify the 2FA and retrieve the JWT token
    const result = await verifyTwoFactorCode(userId, twoFactorCode);
    const token = result.token;  // Access the token from the result object
    console.log('cookie token', token);
    // Set the raw JWT token directly in the cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'Strict',
      maxAge: 3600000, // 1 hour
    });

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error in 2FA Verification:', error.message);
    res.status(401).json({ message: error.message });
  }
});


  
app.post('/api/logout', (req, res) => {
  // Clear the authToken cookie
  res.clearCookie('authToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  });

  res.status(200).json({ message: 'Logout successful' });
});

  

  app.use('/api/auth', router);
}
