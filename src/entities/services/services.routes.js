// import express from "express";
// import {
//   createService,
//   deleteService,
//   getAllServices,
//   getServiceById,
//   updateService
// } from "./services.controller.js";
// import { verifyToken, adminMiddleware } from "../../core/middlewares/authMiddleware.js";


// const router = express.Router();

// // Public routes
// router.get("/get-all-services", getAllServices);
// router.get("/:id", getServiceById);

// // Admin-only routes
// router.post("/", verifyToken, adminMiddleware, createService);
// router.put("/:id", verifyToken, adminMiddleware, updateService);
// router.delete("/:id", verifyToken, adminMiddleware, deleteService);

// export default router;
