import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { postsRoutes } from "./routes/tasks.js";
import { customersRoutes } from "./routes/customers.js";
import { authRoutes } from "./routes/auth.js";
import { initDatabase } from "./db/init.js"; // Adjust the path if needed
import cookieParser from 'cookie-parser';
import { authenticateToken } from './middleware/auth.js';

// Initialize dotenv
dotenv.config();

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:4200'
    ];

    // If origin is in allowed origins or the request doesn't include an origin
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);  // Allow the request
    } else {
      callback(new Error('Not allowed by CORS'), false);  // Block the request
    }
  },
  credentials: true, // Allow credentials (cookies)
}));

app.use(express.json());

app.use(cookieParser());
postsRoutes(app);
customersRoutes(app);
authRoutes(app);

app.use((req, res, next) => {
  const openPaths = ['/api/auth/login', '/api/auth/verify-2fa'];

  if (openPaths.includes(req.path)) {
    return next();
  }

  authenticateToken(req, res, next);
});
try {
  await initDatabase();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.info(`Express server running on http://localhost:${PORT}`)
  );
} catch (e) {
  console.error("Error when connecting to DB", e);
}
