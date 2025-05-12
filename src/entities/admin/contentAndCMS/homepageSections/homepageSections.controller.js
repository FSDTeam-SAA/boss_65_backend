import { generateResponse } from '../../lib/responseFormate.js';
import {
    createHomepageSectionService,
    getAllHomepageSectionsService,
    updateHomepageSectionService,
    deleteHomepageSectionService,
} from './homepageSections.service.js';

export const createHomepageSection = async (req, res) => {
    try {
        const homepageSection = await createHomepageSectionService(req.body);
        generateResponse(res, 201, true, 'Homepage section created successfully', homepageSection);
    } catch (error) {
        generateResponse(res, 500, false, 'Failed to create homepage section', null);
    }
};

export const getAllHomepageSections = async (req, res) => {
    try {
        const homepageSections = await getAllHomepageSectionsService();
        generateResponse(res, 200, true, 'Homepage sections retrieved successfully', homepageSections);
    } catch (error) {
        generateResponse(res, 500, false, 'Failed to retrieve homepage sections', null);
    }
};

export const updateHomepageSection = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedHomepageSection = await updateHomepageSectionService(id, req.body);
        generateResponse(res, 200, true, 'Homepage section updated successfully', updatedHomepageSection);
    } catch (error) {
        generateResponse(res, 500, false, 'Failed to update homepage section', null);
    }
};

export const deleteHomepageSection = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedHomepageSection = await deleteHomepageSectionService(id);
        generateResponse(res, 200, true, 'Homepage section deleted successfully', deletedHomepageSection);
    } catch (error) {
        generateResponse(res, 500, false, 'Failed to delete homepage section', null);
    }
};

