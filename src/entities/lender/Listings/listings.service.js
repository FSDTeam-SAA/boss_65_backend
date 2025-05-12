import listings from "../Listings/listings.model.js";

export const createDress = async (data) => {
  const dress = new listings(data);
  return await dress.save();
};

export const getAllDresses = async (filter = {}) => {
  return await listings.find(filter).populate('lender', 'fullName email');
};

export const getDressById = async (id) => {
  return await listings.findById(id).populate('lender', 'fullName email');
};

export const getDressesByLender = async (lenderId) => {
  return await listings.find({ lender: lenderId });
};

export const updateDress = async (id, updateData) => {
  return await listings.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteDress = async (id) => {
  return await listings.findByIdAndDelete(id);
};
