import { generateResponse } from '../../lib/responseFormate.js';
import { 
    createItemService, 
    getItemsService, 
    getItemByIdService, 
    updateItemService, 
    deleteItemService 
} from './termsAndConditions.service.js';

export const createItem = async (req, res) => {
    try {
        const newItem = await createItemService(req.body);
        generateResponse(res, 201, true, 'Item created successfully', newItem);
    } catch (error) {
        generateResponse(res, 500, false, 'Failed to create item', null);
    }
};

export const getItems = async (req, res) => {
    try {
        const items = await getItemsService();
        generateResponse(res, 200, true, 'Items fetched successfully', items);
    } catch (error) {
        generateResponse(res, 500, false, 'Failed to fetch items', null);
    }
};

export const getItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await getItemByIdService(id);
        if (!item) {
            return generateResponse(res, 404, false, 'Item not found', null);
        }
        generateResponse(res, 200, true, 'Item fetched successfully', item);
    } catch (error) {
        generateResponse(res, 500, false, 'Failed to fetch item', null);
    }
};

export const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedItem = await updateItemService(id, req.body);
        if (!updatedItem) {
            return generateResponse(res, 404, false, 'Item not found', null);
        }
        generateResponse(res, 200, true, 'Item updated successfully', updatedItem);
    } catch (error) {
        generateResponse(res, 500, false, 'Failed to update item', null);
    }
};

export const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await deleteItemService(id);
        if (!deleted) {
            return generateResponse(res, 404, false, 'Item not found', null);
        }
        generateResponse(res, 200, true, 'Item deleted successfully', null);
    } catch (error) {
        generateResponse(res, 500, false, 'Failed to delete item', null);
    }
};

