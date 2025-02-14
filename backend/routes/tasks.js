import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/tasks.js";
import { authenticateToken } from '../middleware/auth.js';
import cors from 'cors'; // Import CORS
import axios from 'axios';

export function postsRoutes(app) {
  // Get all tasks for the authenticated user
  app.get("/api/tasks", authenticateToken, async (req, res) => {
    try {
    
      const  customerId  = req.userId; // Extract customerId from the decoded token (via middleware)
      const tasks = await getAllTasks(customerId); // Use customerId to filter tasks
      
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create a new task
  app.post("/api/tasks", authenticateToken, async (req, res) => {
    try {
      const  customerId  = req.userId; // Extract customerId from the decoded token
      const taskData = { ...req.body, customerId }; // Attach customerId to the task
      const task = await createTask(taskData); // Pass the full task data with customerId
      res.status(201).json(task);
    } catch (error) {
      console.error("Error in creating task:", error.message);
      res.status(400).json({ message: error.message });
    }
  });

  // Update an existing task
  app.put("/api/tasks/:id", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const  customerId  = req.userId; // Extract customerId from the decoded token
      const updatedTask = await updateTask(id, req.body, customerId); // Pass customerId for authorization
      res.json(updatedTask);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Delete a task
  app.delete("/api/tasks/:id", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const  customerId  = req.userId; // Extract customerId from the decoded token
      const result = await deleteTask(id, customerId); // Pass customerId to ensure authorization
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });

  app.post('/chat', async (req, res) => {
    
    try {
      const { prompt } = req.body; // Extract the prompt from the request body
  
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }
  
      // Define the request body for OpenAI API
      const body = {
        model: 'gpt-3.5-turbo', // Model specification
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 100,
        temperature: 0.7,
        n: 1,
      };
  
      // Make a request to OpenAI's API
      const response = await axios.post('https://api.openai.com/v1/chat/completions', body, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Use your OpenAI API key securely from environment variables
          'Content-Type': 'application/json',
        },
      });
  
      // Map the response to extract clean suggestions
      const suggestions = response.data.choices.map((choice) => choice.message.content.trim());
  
      // Send the suggestions back to the frontend
      res.json(suggestions);
    } catch (error) {
      console.error('Error communicating with OpenAI:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
    }
  });
}
