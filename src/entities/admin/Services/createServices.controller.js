
import { generateResponse } from "../../../lib/responseFormate.js";
import { createService, getAllServices, getServiceByCategoryId, getServiceById } from "./createServices.service.js";



export const createServiceController = async (req, res) => {
  try {
    const service = await createService(req.body);
generateResponse(res, 200, true, service, "Service created successfully");
  } catch (err) {
    console.error(err);
generateResponse(res, 500, false, null, "Internal server error");}
};

export const getAllServicesController = async (req, res) => {
    try {
      const services = await getAllServices();
      res.status(200).json({ services });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch services', error: err.message });
    }
  };

  export const getServiceByIdController = async (req, res) => {
    try {
      const service = await getServiceById(req.params.id);
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      res.status(200).json({ service });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch service', error: err.message });
    }
  };


  export const getServiceByCategoryIdController = async (req, res) => {
    try {
      const service = await getServiceByCategoryId(req.params.categoryId);
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      res.status(200).json({ service });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch service', error: err.message });
    }
  }