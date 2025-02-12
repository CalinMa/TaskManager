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

  // Verify 2FA Route
  router.post('/verify-2fa', async (req, res) => {
    try {
      console.log('Request Body:', req.body);
  
      const { userId, twoFactorCode } = req.body;
  
      // Call verifyTwoFactorCode to handle logic and get token
      const token = await verifyTwoFactorCode(userId, twoFactorCode);
  
      console.log('Token Sent to Client:', token);
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Error in 2FA Verification:', error.message);
      res.status(401).json({ message: error.message });
    }
  });
  
  app.post('/api/logout', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header
    if (!token) {
      return res.status(400).json({ message: 'No token provided' });
    }
  
    // If tokens are stored in a database or cache, invalidate the token here
    // Example: Remove the token from a database or in-memory store
    console.log(`Invalidating token: ${token}`);
  
    res.status(200).json({ message: 'Logout successful' });
  });
  

  app.use('/api/auth', router);
}
