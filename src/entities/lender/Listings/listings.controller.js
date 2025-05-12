import * as listingService from '../Listings/listings.service.js';

// POST /api/dresses
export const listDress = async (req, res, next) => {
  try {
    const dress = await listingService.createDress(req.body);
    res.status(201).json(dress);
  } catch (error) {
    next(error);
  }
};

// GET /api/dresses
export const getAllDresses = async (req, res, next) => {
  try {
    const dresses = await listingService.getAllDresses();
    res.status(200).json(dresses);
  } catch (error) {
    next(error);
  }
};

// GET /api/dresses/:id
export const getDressById = async (req, res, next) => {
  try {
    const dress = await listingService.getDressById(req.params.id);
    if (!dress) return res.status(404).json({ message: 'Dress not found' });
    res.status(200).json(dress);
  } catch (error) {
    next(error);
  }
};

// GET /api/dresses/lender/:lenderId
export const getDressesByLender = async (req, res, next) => {
  try {
    const dresses = await listingService.getDressesByLender(req.params.lenderId);
    res.status(200).json(dresses);
  } catch (error) {
    next(error);
  }
};

// PUT /api/dresses/:id
export const updateDress = async (req, res, next) => {
  try {
    const updated = await listingService.updateDress(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Dress not found' });
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/dresses/:id
export const deleteDress = async (req, res, next) => {
  try {
    const deleted = await listingService.deleteDress(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Dress not found' });
    res.status(200).json({ message: 'Dress deleted successfully' });
  } catch (error) {
    next(error);
  }
};
