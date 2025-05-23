import bookingModel from "../../booking/booking.model.js";

export const getDashboardData = async (startDate, endDate) => {
    
    // validate start and end date
    if (!startDate || !endDate) {
        throw new Error("Start date and end date are required");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error("Invalid start or end date format.");
    }

    if (start > end) {
        throw new Error("Start date cannot be greater than end date");
    }
    

    // Fetch all bookings within the date range
    const totalBookings = await bookingModel.find({
        createdAt: { $gte: start, $lte: end }
    }).sort({ createdAt: -1 });


    // Calculate total revenue 
    const totalRevenueAgg = await bookingModel.aggregate([
        {
            $match: {
                createdAt: { $gte: start, $lte: end },
                status: "confirmed",
                paymentStatus: "paid",
            },
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$total" },
            },
        },
    ]);


    // Calculate total refunds
    const totalRefundAgg = await bookingModel.aggregate([
        {
            $match: {
                createdAt: { $gte: start, $lte: end },
                status: "refunded",
                paymentStatus: "refunded",
            },
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$total" },
            },
        },
    ]);


    // Formate for time-series trends
    const MONTHS = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const diffInDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    let groupFormat, labelKey;

    if (diffInDays <= 30) {
        groupFormat = "%Y-%m-%d";
        labelKey = "day";
    } else if (diffInDays <= 365) {
        groupFormat = "%Y-%m";
        labelKey = "month";
    } else {
        groupFormat = "%Y";
        labelKey = "year";
    }


    // aggregate booking trends
    const trends = await bookingModel.aggregate([
        {
            $match: {
                createdAt: { $gte: start, $lte: end },
                status: "confirmed",
                paymentStatus: "paid",
            },
        },
        {
            $group: {
                _id: {
                    date: { $dateToString: { format: groupFormat, date: "$createdAt" } },
                },
                totalRevenue: { $sum: "$total" },
                bookingCount: { $sum: 1 },
            },
        },
        { $sort: { "_id.date": 1 } }
    ]);


    // convert aggregated data to time-series format
    const bookingData = [];
    const revenueData = [];

    trends.forEach(item => {
        let label = item._id.date;

        if (labelKey === "month") {
            const [year, month] = label.split("-");
            label = MONTHS[parseInt(month, 10) - 1];
        }

        bookingData.push({ label, value: item.bookingCount });
        revenueData.push({ label, value: item.totalRevenue });
    });


    // average booking duration
    let totalDuration = 0;
    let totalDurationBookings = 0;

    for (const booking of totalBookings) {
        if (booking.status === 'confirmed' && booking.paymentStatus === 'paid') {
            let bookingDuration = 0;

            for (const slot of booking.timeSlots) {
                if (slot.start && slot.end) {
                    const [sh, sm] = slot.start.split(":").map(Number);
                    const [eh, em] = slot.end.split(":").map(Number);
                    const duration = (eh * 60 + em) - (sh * 60 + sm);
                    bookingDuration += duration;
                }
            }

            if (bookingDuration > 0) {
                totalDuration += bookingDuration;
                totalDurationBookings++;
            }
        }
    }

    const averageDurationInMinutes = totalDurationBookings > 0 ? totalDuration / totalDurationBookings : 0;
    const averageDurationFormatted = `${Math.floor(averageDurationInMinutes / 60)}h ${Math.round(averageDurationInMinutes % 60)}m`;


    // Customer type stats
    const customerTypeStats = await bookingModel.aggregate([
    {
        $match: {
            createdAt: { $gte: start, $lte: end }
        }
    },
    {
        $sort: { "createdAt": 1 }
    },
    {
        $group: {
            _id: "$user.email",
            firstBookingDate: { $first: "$createdAt" },
            bookingsInRange: {
                $push: {
                    createdAt: "$createdAt"
                }
            }
        }
    },
    {
        $project: {
            isNewInRange: {
                $cond: [
                    {
                        $and: [
                            { $gte: [ "$firstBookingDate", start ] },
                            { $lte: [ "$firstBookingDate", end ] }
                        ]
                    },
                    true,
                    false
                ]
            }
        }
    },
    {
        $group: {
            _id: "$isNewInRange",
            count: { $sum: 1 }
        }
    }
    ]);

    
    // Parse the result
    let newCustomers = 0;
    let returningCustomers = 0;

    customerTypeStats.forEach(item => {
        if (item._id === true) {
            newCustomers = item.count;
        } else {
            returningCustomers = item.count;
        }
    });


    return {
        totalBookings: totalBookings.length,
        totalRevenue: totalRevenueAgg[0]?.totalRevenue || 0,
        totalRefund: totalRefundAgg[0]?.totalRevenue || 0,
        averageBookingDuration: {
            inMinutes: Math.round(averageDurationInMinutes),
            formatted: averageDurationFormatted,
        },
        trends: {
            bookingData,
            revenueData,
        },
        customerTypes: {
            new: newCustomers,
            returning: returningCustomers,
        },
        recentBookings: totalBookings.slice(0, 5).map(booking => ({
            id: booking._id,
            user: booking.user,
            room: booking.room,
            date: booking.date,
            timeSlots: booking.timeSlots,
            service: booking.service,
            total: booking.total,
            status: booking.status,
        })),
    };
};
