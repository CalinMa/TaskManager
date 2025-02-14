import { Customer } from '../db/models/customer.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { sendEmail } from '../utils/email.js';

// Login Function
export async function login(username, password) {
  try {
    // Step 1: Find the user in the database
    const user = await Customer.findOne({ username });
    if (!user) {
      throw new Error('User not found');
    }

    // Step 2: Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Step 3: Generate a 2FA code
    const twoFactorCode = Math.floor(100000 + Math.random() * 900000); // 6-digit code
    user.twoFactorCode = twoFactorCode;
    await user.save();

    // Step 4: Send the 2FA code via email
    const subject = 'Your 2FA Code';
    const message = `Your 2FA code is: ${twoFactorCode}`;
    await sendEmail(user.email, subject, message);

    console.log(`2FA Code sent to ${user.email}`, `The code is ${twoFactorCode}`); // For debugging purposes only

    // Return the user ID to the client for 2FA verification
    return { userId: user._id };
  } catch (error) {
    console.error('Login failed:', error.message);
    throw new Error(error.message);
  }
}

// Verify 2FA Code Function
export async function verifyTwoFactorCode(userId, twoFactorCode) {
  try {
    // Step 1: Find the user in the database
    const user = await Customer.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Step 2: Validate the 2FA code
    console.log('Stored 2FA Code:', user.twoFactorCode, 'Provided 2FA Code:', twoFactorCode);
    if (user.twoFactorCode !== parseInt(twoFactorCode, 10)) {
      throw new Error('Invalid 2FA code');
    }

    // Step 3: Generate a JWT token
    const token = jwt.sign({ userId: user._id, customerId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    console.log('JWT Token Generated:', token);

    // Step 4: Clear the 2FA code from the database
    user.twoFactorCode = null;
    await user.save();

    return { token };
  } catch (error) {
    console.error('2FA verification failed:', error.message);
    throw new Error(error.message);
  }
}
