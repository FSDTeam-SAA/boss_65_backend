// import mongoose from "mongoose";
// import Service from "./services.model.js";


// export const createServiceService = async (data) => {
//   const service = new Service(data);
//   return await service.save();
// };


// export const getAllServicesService = async () => {
//   return await Service.find()
//     .populate("category", "name")
//     .populate("room", "title")
//     .sort({ createdAt: -1 });
// };


// export const getServiceByIdService = async (id) => {
//   if (!mongoose.Types.ObjectId.isValid(id)) return null;
//   return await Service.findById(id)
//     .populate("category", "name")
//     .populate("room", "title");
// };


// export const updateServiceService = async (id, updateData) => {
//   if (!mongoose.Types.ObjectId.isValid(id)) return null;
//   return await Service.findByIdAndUpdate(id, updateData, {
//     new: true,
//     runValidators: true,
//   })
//     .populate("category", "name")
//     .populate("room", "title");
// };


// export const deleteServiceService = async (id) => {
//   if (!mongoose.Types.ObjectId.isValid(id)) return null;
//   const result = await Service.findByIdAndDelete(id);
//   return result ? true : false;
// };
