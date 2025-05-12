import listings from './listings.model.js';

export const createDress = async (data) => {
  const dress = new listings(data);
  return await dress.save();
};

export const getAllDresses = async (page, limit, skip) => {
  const allDresses = await listings
    .find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('lender', 'fullName email')
    .lean();

  const totalItems = await listings.countDocuments();
  const totalPages = Math.ceil(totalItems / limit);

  return {
    data: allDresses,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit
    }
  };
};

export const getDressById = async (id) => {
  return await listings.findById(id).populate('lender', 'fullName email');
};

export const getDressesByLender = async (lenderId) => {
  return await listings.find({ lender: lenderId }).sort({ createdAt: -1 });
};

export const updateDress = async (id, updateData) => {
  return await listings.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteDress = async (id) => {
  return await listings.findByIdAndDelete(id);
};
