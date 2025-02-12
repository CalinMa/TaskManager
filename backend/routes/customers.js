import express from 'express';
import {
  getAllCustomers,
  createCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from '../services/customers.js';

export function customersRoutes(app) {
  // Fetch all customers
  app.get('/api/customers', async (req, res) => {
    try {
      const customers = await getAllCustomers();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create a new customer
  app.post('/api/customers', async (req, res) => {
    try {
      const customer = await createCustomer(req.body);
      res.status(201).json(customer);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get a customer by ID
  app.get('/api/customers/:id', async (req, res) => {
    try {
      const customer = await getCustomerById(req.params.id);
      res.json(customer);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  });

  // Update a customer by ID
  app.put('/api/customers/:id', async (req, res) => {
    try {
      const customer = await updateCustomer(req.params.id, req.body);
      res.json(customer);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Delete a customer by ID
  app.delete('/api/customers/:id', async (req, res) => {
    try {
      const result = await deleteCustomer(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
}
