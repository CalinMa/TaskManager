import { Customer } from "../db/models/customer.js";
import mongoose from "mongoose";

// Fetch all customers
export async function getAllCustomers() {
  try {
    return await Customer.find().lean();
  } catch (error) {
    throw new Error("Failed to fetch customers");
  }
}

// Create a new customer
export async function createCustomer(customerData) {
  try {
    const customer = new Customer(customerData);
    return await customer.save();
  } catch (error) {
    // Check for Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err) => err.message);
      throw new Error(`Validation Error: ${validationErrors.join(', ')}`);
    }

    // Check for duplicate key errors (e.g., unique constraints)
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue).join(', ');
      throw new Error(`Duplicate Error: ${duplicateField} already exists`);
    }

    // General error message
    throw new Error(`Failed to create customer: ${error.message}`);
  }
}


// Fetch a single customer by ID
export async function getCustomerById(id) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid customer ID");
    }
    const customer = await Customer.findById(id).lean();
    if (!customer) {
      throw new Error("Customer not found");
    }
    return customer;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch customer");
  }
}

// Update a customer by ID
export async function updateCustomer(id, customerData) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid customer ID");
    }
    const customer = await Customer.findByIdAndUpdate(id, customerData, {
      new: true,
    });
    if (!customer) {
      throw new Error("Customer not found");
    }
    return customer;
  } catch (error) {
    throw new Error(error.message || "Failed to update customer");
  }
}

// Delete a customer by ID
export async function deleteCustomer(id) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid customer ID");
    }
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) {
      throw new Error("Customer not found");
    }
    return { message: "Customer deleted successfully" };
  } catch (error) {
    throw new Error(error.message || "Failed to delete customer");
  }
}
