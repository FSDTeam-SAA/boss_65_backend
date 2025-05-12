export const createItemService = async (data) => {
  const item = await TermsAndConditions.create(data);
  return item;
};

export const getItemsService = async () => {
  const items = await TermsAndConditions.find();
  return items;
};

export const getItemByIdService = async (id) => {
  const item = await TermsAndConditions.findById(id);
  if (!item) throw new Error('Item not found');
  return item;
};

export const updateItemService = async (id, data) => {
  const item = await TermsAndConditions.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!item) throw new Error('Item not found');
  return item;
};

export const deleteItemService = async (id) => {
  const item = await TermsAndConditions.findByIdAndRemove(id);
  if (!item) throw new Error('Item not found');
  return item;
};
