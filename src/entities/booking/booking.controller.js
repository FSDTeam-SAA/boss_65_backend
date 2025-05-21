import { generateResponse } from '../../lib/responseFormate.js';
import { checkAvailabilityService, createBookingService } from './booking.service.js';
import Booking from './booking.model.js';


export const createBookingController = async (req, res) => {
  try {
    const {
      user,
      date,
      timeSlots,
      service,
      room,
      promoCode,
      numberOfPeople,
    } = req.body;

    // Basic validation
    if (!user || !user.firstName || !user.lastName || !user.email || !user.phone) {
      return generateResponse(res, 400, false, "User details are incomplete");
    }
    if (!date || !timeSlots || !service || !room || !numberOfPeople) {
      return generateResponse(res, 400, false, "Missing required booking fields");
    }
    if (!Array.isArray(timeSlots) || timeSlots.length === 0) {
      return generateResponse(res, 400, false, "At least one time slot must be selected");
    }

    // Create booking
    const booking = await createBookingService({
      user,
      date,
      timeSlots,
      service,
      room,
      promoCode,
      numberOfPeople,
    });

    generateResponse(res, 201, true, "Booking created successfully", booking);
  } catch (error) {
    console.error("Create Booking Error:", error);
    generateResponse(res, 500, false, "Booking failed", error.message);
  }
};


export const getAllBookings = async (req, res) => {
    try {
        const bookings = await bookingService.getAllBookings();
        return generateResponse(res, 200, true, 'Bookings fetched successfully', bookings);
    } catch (error) {
        return generateResponse(res, 500, false, 'Failed to fetch bookings', null);
    }
};


export const getBookingById = async (req, res) => {
    try {
        const booking = await bookingService.getBookingById(req.params.id);
        return generateResponse(res, 200, true, 'Booking fetched successfully', booking);
    } catch (error) {
        return generateResponse(res, 404, false, error.message, null);
    }
};


export const updateBooking = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return generateResponse(res, 400, false, 'Status is required', null);
        }

        const updatedBooking = await bookingService.updateBooking(req.params.id, status);
        return generateResponse(res, 200, true, 'Booking status updated successfully', updatedBooking);
    } catch (error) {
        return generateResponse(res, 400, false, error.message, null);
    }
};


export const deleteBooking = async (req, res) => {
    try {
        await bookingService.deleteBooking(req.params.id);
        return generateResponse(res, 200, true, 'Booking deleted successfully', null);
    } catch (error) {
        return generateResponse(res, 400, false, error.message, null);
    }
};


export const checkAvailabilityController = async (req, res) => {
  try {
    const { date, serviceId } = req.body;

    if (!date || !serviceId) {
      return generateResponse(res, 400, false, "date and serviceId are required");
    }

    const result = await checkAvailabilityService(date, serviceId);

    if (!result.available) {
      return generateResponse(
        res,
        200,
        true,
        `This service not available on ${result.weekday}`,
        []
      );
    }

    return generateResponse(res, 200, true, "Available slots fetched successfully", result.slots);
  } catch (error) {
    return generateResponse(res, 500, false, "Failed to check availability", error.message);
  }
};



export const  getBookingStats = async (req, res) => {
  try {
    const year = new Date().getFullYear(); // optionally support query param
    const start = new Date(`${year}-01-01`);
    const end = new Date(`${year}-12-31`);

    // Monthly booking, revenue, refunds, and unique users
    const stats = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $addFields: {
          month: { $month: "$createdAt" }
        }
      },
      {
        $group: {
          _id: "$month",
          bookings: { $sum: 1 },
          revenue: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$status", "confirmed"] }, { $eq: ["$paymentStatus", "paid"] }] },
                "$total",
                0
              ]
            }
          },
          refunds: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "refunded"] }, "$total", 0]
            }
          },
          users: { $addToSet: "$user.email" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Repeated & new users (confirmed + paid only)
    const userStats = await Booking.aggregate([
      {
        $match: {
          status: "confirmed",
          paymentStatus: "paid",
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: "$user.email",
          count: { $sum: 1 }
        }
      }
    ]);

    const repeatedUsers = userStats.filter(u => u.count > 1).length;
    const newUsers = userStats.filter(u => u.count === 1).length;

    // Format monthly data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const finalData = Array.from({ length: 12 }, (_, i) => {
      const monthStat = stats.find(s => s._id === i + 1);
      return {
        name: months[i],
        bookings: monthStat?.bookings || 0,
        revenue: monthStat?.revenue || 0,
        refunds: monthStat?.refunds || 0,
        uniqueUsers: monthStat?.users.length || 0
      };
    });

    generateResponse(res, 200, true, "Booking stats fetched successfully", { stats: finalData,
      repeatedUsers,
      newUsers})
    }
       catch (error) {
    console.error("Failed to get booking stats:", error);
    generateResponse(res, 500, false, "Failed to get booking stats", error.message);
  }
};
