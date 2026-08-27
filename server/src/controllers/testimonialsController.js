const Testimonial = require('../models/Testimonial');

// GET all visible testimonials (public)
exports.getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ isVisible: true }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    next(error);
  }
};

// GET all testimonials (admin)
exports.getAllTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    next(error);
  }
};

// POST create a testimonial
exports.createTestimonial = async (req, res, next) => {
  try {
    const newTestimonial = await Testimonial.create(req.body);
    res.status(201).json({ success: true, data: newTestimonial });
  } catch (error) {
    next(error);
  }
};

// PUT update a testimonial
exports.updateTestimonial = async (req, res, next) => {
  try {
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTestimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    res.json({ success: true, data: updatedTestimonial });
  } catch (error) {
    next(error);
  }
};

// DELETE a testimonial
exports.deleteTestimonial = async (req, res, next) => {
  try {
    const deletedTestimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!deletedTestimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
