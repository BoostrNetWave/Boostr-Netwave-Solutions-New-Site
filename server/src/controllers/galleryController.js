const Gallery = require('../models/Gallery');

// GET all visible gallery items (public)
exports.getGallery = async (req, res, next) => {
  try {
    const galleryItems = await Gallery.find({ isVisible: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: galleryItems });
  } catch (error) {
    next(error);
  }
};

// GET all gallery items (admin)
exports.getAllGallery = async (req, res, next) => {
  try {
    const galleryItems = await Gallery.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: galleryItems });
  } catch (error) {
    next(error);
  }
};

// POST create a gallery item
exports.createGalleryItem = async (req, res, next) => {
  try {
    const newItem = await Gallery.create(req.body);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    next(error);
  }
};

// PUT update a gallery item
exports.updateGalleryItem = async (req, res, next) => {
  try {
    const updatedItem = await Gallery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }
    res.json({ success: true, data: updatedItem });
  } catch (error) {
    next(error);
  }
};

// DELETE a gallery item
exports.deleteGalleryItem = async (req, res, next) => {
  try {
    const deletedItem = await Gallery.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
