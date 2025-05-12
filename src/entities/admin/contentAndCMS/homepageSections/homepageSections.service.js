export const createHomepageSectionService = async (data) => {
  const newHomepageSection = await HomepageSection.create(data);
  return newHomepageSection;
};

export const getAllHomepageSectionsService = async () => {
  const homepageSections = await HomepageSection.find();
  return homepageSections;
};

export const updateHomepageSectionService = async (id, data) => {
  const updatedHomepageSection = await HomepageSection.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  return updatedHomepageSection;
};

export const deleteHomepageSectionService = async (id) => {
  await HomepageSection.findByIdAndDelete(id);
  return { message: 'Homepage section deleted successfully' };
};
