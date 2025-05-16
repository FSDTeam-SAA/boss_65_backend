import Room from "./room.model.js";
import mongoose from "mongoose";


export const createRoomService = async (data) => {
  const room = new Room(data);
  return await room.save();
};


export const getAllRoomsService = async () => {
  return await Room.find().populate("category").sort({ createdAt: -1 });
};


export const getRoomByIdService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Room.findById(id).populate("category");
};


export const updateRoomService = async (id, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return await Room.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  }).populate("category");
};


export const deleteRoomService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const result = await Room.findByIdAndDelete(id);
  return result ? true : false;
};
