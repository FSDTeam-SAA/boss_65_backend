import { createBannerService, deleteBannerService, getAllBannersService, getBannerByIdService, updateBannerService } from "./banners.service";
import {generateResponse} from "../../../../lib/responseFormate.js";

export const createBanner = async (req, res) => {
  try {
    const banner = await createBannerService(req.body);
    generateResponse(banner, 201)
  } catch (error) {
    generateResponse(error.message, 400)
  }
};

export const getAllBanners = async (req, res) => {
  try {
    const banners = await getAllBannersService();
    res.json(generateResponse(banners));
  } catch (error) {
    res.status(400).json(generateResponse(error.message, 400));
  }
};

export const getBannerById = async (req, res) => {
  try {
    const banner = await getBannerByIdService(req.params.id);
    res.json(generateResponse(banner));
  } catch (error) {
    res.status(400).json(generateResponse(error.message, 400));
  }
};

export const updateBanner = async (req, res) => {
  try {
    const banner = await updateBannerService(req.params.id, req.body);
    res.json(generateResponse(banner));
  } catch (error) {
    res.status(400).json(generateResponse(error.message, 400));
  }
};

export const deleteBanner = async (req, res) => {
  try {
    await deleteBannerService(req.params.id);
    res.json(generateResponse('Banner deleted successfully', 200));
  } catch (error) {
    res.status(400).json(generateResponse(error.message, 400));
  }
};
