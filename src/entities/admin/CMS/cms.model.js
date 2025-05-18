import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    thumbnail: {
      type: String,
    },
  },
  {
    timestamps: true
  },

);

const faqSchema = new mongoose.Schema(
  {
    question: String,
    answer: String,
  },
  { timestamps: true }
);

const cmsSchema = new mongoose.Schema(
  {
    title: { type: String },
    section: {
      type: String,
      required: true,
      enum: ["gallery", "hero", "testimonial", "alert", "banner", "blog", "faq", "footer"],
    },
    type: {
      type: String,
      enum: ["image", "video", "text"],

    },
    url: {
      type: String,
    },
    public_id: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },


    blog: blogSchema,


    faqs: [faqSchema],
  },
  { timestamps: true }
);

export default mongoose.model("CMS", cmsSchema);
