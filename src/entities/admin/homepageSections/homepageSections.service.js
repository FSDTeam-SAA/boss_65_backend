export const createHomepageSectionService = async (data) => {
  const homepageSection = await HomepageSection.create(data);
  return homepageSection;
};

export const getAllHomepageSectionsService = async () => {
  const homepageSections = await HomepageSection.find();
  return homepageSections;
};
