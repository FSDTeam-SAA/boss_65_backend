import CMS from "./cms.model.js";
import { cloudinaryDelete, cloudinaryUpload } from "../../../lib/cloudinaryUpload.js";
import Blog from "./blog.model.js";
import Faq from "./faq.model.js";

export const uploadCmsAssetService = async ({ file, title, section }) => {
    if (!file) throw new Error("File is required");

    const folder = "admin-cms";
    const public_id = `cms/${Date.now()}-${file.originalname}`;

    const uploaded = await cloudinaryUpload(file.path, public_id, folder);

    if (typeof uploaded === "string" || !uploaded.secure_url) {
        throw new Error("Cloudinary upload failed");
    }

     //  delete duplicate banner from db if already exists
  if (section === "banner") {
    const existingBanner = await CMS.findOne({ section: "banner" });
    if (existingBanner) {
      await CMS.deleteOne({ _id: existingBanner._id });

      // delete from Cloudinary too
      if (existingBanner.public_id) {
        await cloudinaryDelete(existingBanner.public_id); // <== you need to implement this
      }
    }
  }

    const cmsEntry = await CMS.create({
        
        section,
        type: uploaded.resource_type === "video" ? "video" : "image",
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
    });

    return cmsEntry;
};

export const getAllCmsAssetsService = async (filter={}) => {
    return await CMS.find(filter).sort({ createdAt: -1 });
};

export const toggleCmsAssetStatusService = async (cmsId) => {
    const entry = await CMS.findById(cmsId);
    if (!entry) throw new Error("CMS entry not found");

    entry.isActive = !entry.isActive;
    await entry.save();

    return entry;
};



// Create Blog
export const createBlogService = async ({ title, description, thumbnail }) => {
  const blog = new Blog({
    title,
    description,
    thumbnail,
  });
  return await blog.save();
};

// Get all Blogs
export const getAllBlogsService = async () => {
  return await Blog.find().sort({ createdAt: -1 });
};

// Get single Blog by ID
export const getBlogByIdService = async (blogId) => {
  const blog = await Blog.findById(blogId);
  if (!blog) throw new Error("Blog not found");
  return blog;
};

// Update Blog
export const updateBlogService = async (blogId, updateData) => {
  const updated = await Blog.findByIdAndUpdate(blogId, updateData, { new: true });
  if (!updated) throw new Error("Blog not found");
  return updated;
};

// Delete Blog
export const deleteBlogService = async (blogId) => {
  const deleted = await Blog.findByIdAndDelete(blogId);
  if (!deleted) throw new Error("Blog not found or already deleted");
  return deleted;
};

// Toggle Blog Status (isActive)
export const toggleBlogStatusService = async (blogId) => {
  const blog = await Blog.findById(blogId);
  if (!blog) throw new Error("Blog not found");

  blog.isActive = !blog.isActive;
  await blog.save();
  return blog;
};





// Create a new FAQ
export const createFaqService = async ({ question, answer }) => {
  const faq = await Faq.create({ question, answer });
  return faq;
};

// Get all FAQs
export const getAllFaqsService = async () => {
  return await Faq.find().sort({ createdAt: -1 });
};

// Get one FAQ by ID
export const getFaqByIdService = async (faqId) => {
  const faq = await Faq.findById(faqId);
  if (!faq) throw new Error("FAQ not found");
  return faq;
};

// Update FAQ
export const updateFaqService = async (faqId, updateData) => {
  const updated = await Faq.findByIdAndUpdate(faqId, updateData, { new: true });
  if (!updated) throw new Error("FAQ not found");
  return updated;
};

// Delete FAQ
export const deleteFaqService = async (faqId) => {
  const deleted = await Faq.findByIdAndDelete(faqId);
  if (!deleted) throw new Error("FAQ not found or already deleted");
  return deleted;
};

// Toggle FAQ status
export const toggleFaqStatusService = async (faqId) => {
  const faq = await Faq.findById(faqId);
  if (!faq) throw new Error("FAQ not found");

  faq.isActive = !faq.isActive;
  await faq.save();
  return faq;
};
