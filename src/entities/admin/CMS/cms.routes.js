import express from "express";
import {
  uploadCmsAsset,
  getAllCmsAssets,
  toggleCmsAssetStatus,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogById,
  getAllBlogs,
  createFaq,
  getAllFaqs,
  getFaqById,
  updateFaq,
  deleteFaq,
  toggleFaqStatus,
} from "./cms.controller.js";
import { multerUpload } from "../../../core/middlewares/multer.js";
import { adminMiddleware, verifyToken } from "../../../core/middlewares/authMiddleware.js";



const router = express.Router();

router.post("/upload", multerUpload([{ name: "file", maxCount: 5 }]), uploadCmsAsset);

router.get("/assests", getAllCmsAssets);
router.patch("/:id/toggle", verifyToken, adminMiddleware, toggleCmsAssetStatus);
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);


router.post(
  "/create",
  verifyToken, adminMiddleware,
  multerUpload([{ name: "thumbnail", maxCount: 1 }]),
  createBlog
);
router.put("/:id", verifyToken, adminMiddleware, updateBlog);
router.delete("/:id", verifyToken, adminMiddleware, deleteBlog);

router
  .post("/faq", verifyToken, adminMiddleware, createFaq)
  .get("/faq", verifyToken, adminMiddleware, getAllFaqs)
  .get("/faq/:id", verifyToken, adminMiddleware, verifyToken, adminMiddleware, getFaqById)
  .put("/faq/:id", verifyToken, adminMiddleware, updateFaq)
  .delete("/faq/:id", verifyToken, adminMiddleware, deleteFaq)
  .patch("/faq/:id/toggle", verifyToken, adminMiddleware, toggleFaqStatus);



export default router;
