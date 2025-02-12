import mongoose from "mongoose";

// Define the schema
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, default: false },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true }
});

// Define the model
const Task = mongoose.model('Task', taskSchema);

// Export the model
export default Task;
