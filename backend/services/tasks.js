import Task from '../db/models/tasks.js';
import mongoose from 'mongoose';

// Fetch all tasks
export async function getAllTasks(customerId) {
  try {
    const tasks = await Task.find({ customerId }).lean();
    return tasks.map((task) => ({
      ...task,
      id: task._id,
      _id: undefined,
    }));
  } catch (error) {
    throw new Error('Failed to fetch tasks');
  }
}

// Create a new task
export async function createTask(taskData) {
    console.log('task data', taskData)
    const { title, description, completed, customerId } = taskData;
    if (!customerId) {
        throw new Error('Customer ID is required to create a task');
      }
  try {
    const task = new Task({
        title,
        description,
        completed: completed || false,
        customerId,
      })
    await task.save();
    return task;
  } catch (error) {
    throw new Error('Failed to create task');
  }
}

// Update a task
export async function updateTask(id, taskData) {
    const { customerId, ...updates } = taskData;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid task ID');
    }
      const task = await Task.findOneAndUpdate(
    { _id: id, customerId }, // Match by taskId and customerId
    updates,
    { new: true } // Return the updated document
  );
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  } catch (error) {
    throw new Error(error.message || 'Failed to update task');
  }
}

// Delete a task
export async function deleteTask(id, customerId) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid task ID');
    }

    // Match both the ID and customerId in the query
    const task = await Task.findOneAndDelete({ _id: id, customerId });
    if (!task) {
      throw new Error('Task not found or unauthorized access');
    }

    return { message: 'Task deleted successfully' };
  } catch (error) {
    throw new Error(error.message || 'Failed to delete task');
  }
}
