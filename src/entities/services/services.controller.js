import * as serviceService from "./services.service.js";
import { generateResponse } from "../../lib/responseFormate.js";


export const createService = async (req, res) => {
  try {
    const service = await serviceService.createServiceService(req.body);
    generateResponse(res, 201, true, "Service created successfully", service);
  } catch (error) {
    generateResponse(res, 400, false, "Failed to create service", error.message);
  }
};


export const getAllServices = async (req, res) => {
  try {
    const services = await serviceService.getAllServicesService();
    generateResponse(res, 200, true, "Services fetched successfully", services);
  } catch (error) {
    generateResponse(res, 500, false, "Failed to fetch services", error.message);
  }
};


export const getServiceById = async (req, res) => {
  try {
    const service = await serviceService.getServiceByIdService(req.params.id);
    if (!service) {
      return generateResponse(res, 404, false, "Service not found");
    }
    generateResponse(res, 200, true, "Service fetched successfully", service);
  } catch (error) {
    generateResponse(res, 500, false, "Failed to fetch service", error.message);
  }
};


export const updateService = async (req, res) => {
  try {
    const updatedService = await serviceService.updateServiceService(req.params.id, req.body);
    if (!updatedService) {
      return generateResponse(res, 404, false, "Service not found");
    }
    generateResponse(res, 200, true, "Service updated successfully", updatedService);
  } catch (error) {
    generateResponse(res, 400, false, "Failed to update service", error.message);
  }
};


export const deleteService = async (req, res) => {
  try {
    const deleted = await serviceService.deleteServiceService(req.params.id);
    if (!deleted) {
      return generateResponse(res, 404, false, "Service not found");
    }
    generateResponse(res, 200, true, "Service deleted successfully");
  } catch (error) {
    generateResponse(res, 400, false, "Failed to delete service", error.message);
  }
};
