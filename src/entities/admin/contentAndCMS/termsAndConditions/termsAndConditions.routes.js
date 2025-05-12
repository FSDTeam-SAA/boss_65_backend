import express from 'express';
import { createItem, getItems, getItemById, updateItem, deleteItem } from './yourController.js';

const router = express.Router();

// Create a new item
router.post('/', createItem);

// Get all items
router.get('/', getItems);

// Get a specific item by ID
router.get('/:id', getItemById);

// Update an item by ID
router.put('/:id', updateItem);

// Delete an item by ID
router.delete('/:id', deleteItem);

export default router;

