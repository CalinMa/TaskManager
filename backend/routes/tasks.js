import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/tasks.js";

export function postsRoutes(app) {
  app.get("/api/tasks/:customerId", async (req, res) => {
    try {
      const { customerId } = req.params;
      const tasks = await getAllTasks(customerId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  app.post("/api/tasks", async (req, res) => {
    try {
      const task = await createTask(req.body);
      res.status(201).json(task);
    } catch (error) {
      console.error("Error in creating task:", error.message);
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const task = await updateTask(req.params.id, req.body);
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete('/api/tasks/:id', async (req, res) => {
    const { id } = req.params; // Extract task ID from URL params
    const { customerId } = req.query; // Extract customerId from query params
  
    try {
      // Call your deleteTask function with both parameters
      const result = await deleteTask(id, customerId);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });
}
