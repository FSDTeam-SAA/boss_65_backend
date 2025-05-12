import Testimonial from "./testimonials.model.js";

export const createTestimonialService = async (data) => {
  const testimonial = await Testimonial.create(data);
  return testimonial;
};

export const getAllTestimonialsService = async () => {
  const testimonials = await Testimonial.find().sort({ createdAt: -1 });
  return testimonials;
};

export const getTestimonialByIdService = async (id) => {
  const testimonial = await Testimonial.findById(id);
  return testimonial;
};

export const updateTestimonialService = async (id, data) => {
  const testimonial = await Testimonial.findByIdAndUpdate(id, data, { new: true });
  return testimonial;
};

export const deleteTestimonialService = async (id) => {
  const testimonial = await Testimonial.findByIdAndDelete(id);
  return testimonial;
};
