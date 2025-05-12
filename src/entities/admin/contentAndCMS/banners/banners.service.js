import Banner from './banners.model.js';

export const createBannerService = async (data) => {
  const banner = await Banner.create(data);
  return banner;
};

export const getAllBannersService = async () => {
  const banners = await Banner.find();
  return banners;
};

export const getBannerByIdService = async (id) => {
  const banner = await Banner.findById(id);
  return banner;
};

export const updateBannerService = async (id, data) => {
  const banner = await Banner.findByIdAndUpdate(id, data, { new: true });
  return banner;
};

export const deleteBannerService = async (id) => {
  await Banner.findByIdAndDelete(id);
};
