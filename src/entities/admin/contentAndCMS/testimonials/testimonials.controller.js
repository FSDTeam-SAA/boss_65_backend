export const createTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json(generateResponse(testimonial, 'Testimonial created successfully'));
  } catch (error) {
    res.status(400).json(generateResponse(null, error.message, false));
  }
};

export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json(generateResponse(testimonials, 'Testimonials fetched successfully'));
  } catch (error) {
    res.status(400).json(generateResponse(null, error.message, false));
  }
};

export const getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json(generateResponse(null, 'Testimonial not found', false));
    }
    res.status(200).json(generateResponse(testimonial, 'Testimonial fetched successfully'));
  } catch (error) {
    res.status(400).json(generateResponse(null, error.message, false));
  }
};

export const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!testimonial) {
      return res.status(404).json(generateResponse(null, 'Testimonial not found', false));
    }
    res.status(200).json(generateResponse(testimonial, 'Testimonial updated successfully'));
  } catch (error) {
    res.status(400).json(generateResponse(null, error.message, false));
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json(generateResponse(null, 'Testimonial not found', false));
    }
    res.status(200).json(generateResponse(null, 'Testimonial deleted successfully'));
  } catch (error) {
    res.status(400).json(generateResponse(null, error.message, false));
  }
};
