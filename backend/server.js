import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { postsRoutes } from "./routes/tasks.js";
import { customersRoutes } from "./routes/customers.js";
import { authRoutes } from "./routes/auth.js";
import { initDatabase } from "./db/init.js"; // Adjust the path if needed

// Initialize dotenv
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

postsRoutes(app);
customersRoutes(app);
authRoutes(app);

try {
  await initDatabase();
  const PORT = process.env.PORT || 3000; // Fallback to 3000 if PORT is not defined
  app.listen(PORT, () =>
    console.info(`Express server running on http://localhost:${PORT}`)
  );
} catch (e) {
  console.error("Error when connecting to DB", e);
}
