import CMS from "./cms.model.js";
import { cloudinaryDelete, cloudinaryUpload } from "../../../lib/cloudinaryUpload.js";


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
        title,
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

// blog services

export const createBlogService = async ({ title, description, thumbnail }) => {
    const blog = new CMS({ title, description, thumbnail,
        section: "blog", // Set this for blogs
    type: "image",    // Or "video" if needed
    url: thumbnail,
    public_id: ""
     });
    return await blog.save();
};

export const getAllBlogsService = async () => {
    return await CMS.find().sort({ createdAt: -1 });
};

export const getBlogByIdService = async (blogId) => {
    return await CMS.findById(blogId);
};

export const updateBlogService = async (blogId, updateData) => {
    const updated = await CMS.findByIdAndUpdate(blogId, updateData, { new: true });
    if (!updated) throw new Error("Blog not found");
    return updated;
};

export const deleteBlogService = async (blogId) => {
    const deleted = await CMS.findByIdAndDelete(blogId);
    if (!deleted) throw new Error("Blog not found or already deleted");
    return deleted;
};




// Create FAQ (under CMS)
export const createFaqService = async ({ question, answer }) => {
    let faqGroup = await CMS.findOne({ section: "faq" });
  
    if (!faqGroup) {
      faqGroup = await CMS.create({
        title: "FAQ Section",
        section: "faq",
        type: "text",
        faqs: [{ question, answer }],
      });
    } else {
      faqGroup.faqs.push({ question, answer });
      await faqGroup.save();
    }
  
    return faqGroup;
  };
  
  // Get all FAQs
  export const getAllFaqsService = async () => {
    return await CMS.find({ section: "faq" }).sort({ createdAt: -1 });
  };
  
  // Get one FAQ by ID
  export const getFaqByIdService = async (faqId) => {
    return await CMS.findOne({ _id: faqId, section: "faq" });
  };
  
  // Update FAQ
  export const updateFaqService = async (faqId, updateData) => {
    const updated = await CMS.findOneAndUpdate(
      { _id: faqId, section: "faq" },
      {
        ...(updateData.question && { title: updateData.question }),
        ...(updateData.answer && { description: updateData.answer }),
      },
      { new: true }
    );
    if (!updated) throw new Error("FAQ not found");
    return updated;
  };
  
  // Delete FAQ
  export const deleteFaqService = async (faqId) => {
    const deleted = await CMS.findOneAndDelete({ _id: faqId, section: "faq" });
    if (!deleted) throw new Error("FAQ not found or already deleted");
    return deleted;
  };
  
  // Toggle FAQ status
  export const toggleFaqStatusService = async (faqId) => {
    const faq = await CMS.findOne({ _id: faqId, section: "faq" });
    if (!faq) throw new Error("FAQ not found");
  
    faq.isActive = !faq.isActive;
    await faq.save();
    return faq;
  };