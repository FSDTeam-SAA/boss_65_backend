import asyncHandler from "express-async-handler";
import {
  uploadCmsAssetService,
  getAllCmsAssetsService,
  toggleCmsAssetStatusService,
  createBlogService,
  getAllBlogsService,
  getBlogByIdService,
  updateBlogService,
  deleteBlogService,
  createFaqService,
  getAllFaqsService,
  getFaqByIdService,
  updateFaqService,
  deleteFaqService,
  toggleFaqStatusService,
} from "../CMS/cms.service.js";

import { cloudinaryUpload } from "../../../lib/cloudinaryUpload.js";
import { generateResponse } from "../../../lib/responseFormate.js";


// POST /api/admin/cms/upload
export const uploadCmsAsset = asyncHandler(async (req, res) => {
  const { section } = req.body;
  const files = req.files?.file;

  if (!section || !files || files.length === 0) {
    return generateResponse(res, 400, false, "Section and at least one file are required");
  }

  try {
    const uploadPromises = files.map((file) =>
      uploadCmsAssetService({ file, section })
    );

    const assets = await Promise.all(uploadPromises);

    generateResponse(res, 201, true, "CMS assets uploaded successfully", assets);
  } catch (error) {
    generateResponse(res, 500, false, "Failed to upload CMS assets", error.message);
  }
});
  

// GET /api/admin/cms
export const getAllCmsAssets = asyncHandler(async (req, res) => {
  
    const { section ,type} = req.query;
  
    const filter = {};
    if (section) {
      filter.section = section;
    }
  if(type) filter.type=type;
    const assets = await getAllCmsAssetsService(filter);
    
  
   
    if (assets.length === 0) {
      generateResponse
        (res, 404, false, "No assets found for the given section");
    } else {
      generateResponse(res, 200, true, "Fetched assets", assets);
    }
})


// PATCH /api/admin/cms/:id/toggle
export const toggleCmsAssetStatus = asyncHandler(async (req, res) => {
  try {
    const asset = await toggleCmsAssetStatusService(req.params.id);

    if (!asset) {
      return generateResponse(res, 404, false, "CMS asset not found");
    }

    generateResponse(res, 200, true, "CMS asset status toggled successfully", asset);
  } catch (error) {
    generateResponse(res, 500, false, "Failed to toggle CMS asset status", error.message);
  }
});



//BLOG RETED CONTROLLERS
export const createBlog = async (req, res) => {
  try {
    const { title, description } = req.body;
    const thumbnailFile = req.files?.thumbnail?.[0];
    let thumbnail = null;

    if (thumbnailFile) {
      const result = await cloudinaryUpload(thumbnailFile.path, `blog_thumb_${Date.now()}`, "blogs/thumbnails");
      if (result?.secure_url) thumbnail = result.secure_url;
    }

    const blog = await createBlogService({ title, description, thumbnail });
    generateResponse(res, 201, true, "Blog created successfully", blog);
  } catch (error) {
    generateResponse(res, 400, false, "Failed to create blog", error.message);
  }
};


export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await getAllBlogsService();
    generateResponse(res, 200, true, "Fetched blogs", blogs);
  } catch (error) {
    generateResponse(res, 500, false, "Failed to fetch blogs", error.message);
  }
};


export const getBlogById = async (req, res) => {
  try {
    const blog = await getBlogByIdService(req.params.id);
    if (!blog) return generateResponse(res, 404, false, "Blog not found");
    generateResponse(res, 200, true, "Fetched blog", blog);
  } catch (error) {
    generateResponse(res, 500, false, "Failed to fetch blog", error.message);
  }
};


export const updateBlog = async (req, res) => {
  try {
    const updated = await updateBlogService(req.params.id, req.body);
    generateResponse(res, 200, true, "Blog updated successfully", updated);
  } catch (error) {
    generateResponse(res, 400, false, "Failed to update blog", error.message);
  }
};


export const deleteBlog = async (req, res) => {
  try {
    const deleted = await deleteBlogService(req.params.id);
    generateResponse(res, 200, true, "Blog deleted successfully", deleted);
  } catch (error) {
    generateResponse(res, 400, false, "Failed to delete blog", error.message);
  }
};
  

// Create FAQ
export const createFaq = async (req, res) => {
    try {
      const { question, answer } = req.body;
      const faq = await createFaqService({ question, answer });
      generateResponse(res, 201, true, "FAQ created successfully", faq);
    } catch (error) {
      generateResponse(res, 400, false, "Failed to create FAQ", error.message);
    }
};


// Get all FAQs
export const getAllFaqs = async (req, res) => {
  try {
    const faqs = await getAllFaqsService();
    generateResponse(res, 200, true, "Fetched FAQs", faqs);
  } catch (error) {
    generateResponse(res, 500, false, "Failed to fetch FAQs", error.message);
  }
};


// Get single FAQ
export const getFaqById = async (req, res) => {
  try {
    const faq = await getFaqByIdService(req.params.id);
    if (!faq) return generateResponse(res, 404, false, "FAQ not found");
    generateResponse(res, 200, true, "Fetched FAQ", faq);
  } catch (error) {
    generateResponse(res, 500, false, "Failed to fetch FAQ", error.message);
  }
};


// Update FAQ
export const updateFaq = async (req, res) => {
  try {
    const updated = await updateFaqService(req.params.id, req.body);
    generateResponse(res, 200, true, "FAQ updated successfully", updated);
  } catch (error) {
    generateResponse(res, 400, false, "Failed to update FAQ", error.message);
  }
};


// Delete FAQ
export const deleteFaq = async (req, res) => {
  try {
    const deleted = await deleteFaqService(req.params.id);
    generateResponse(res, 200, true, "FAQ deleted successfully", deleted);
  } catch (error) {
    generateResponse(res, 400, false, "Failed to delete FAQ", error.message);
  }
};


// Toggle FAQ active status
export const toggleFaqStatus = async (req, res) => {
  try {
    const toggled = await toggleFaqStatusService(req.params.id);
    generateResponse(res, 200, true, "FAQ status toggled", toggled);
  } catch (error) {
    generateResponse(res, 400, false, "Failed to toggle FAQ status", error.message);
  }
};