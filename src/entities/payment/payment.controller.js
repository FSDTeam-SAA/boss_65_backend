import Stripe from 'stripe';
import Booking from '../booking/booking.model.js';
import { Payment } from './payment.model.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export const payment = async (req, res) => {
  const { booking: bookingId } = req.body;

  if (!bookingId) {
    return res.status(400).json({ success: false, message: 'Booking ID is required.' });
  }

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    const total = booking.total; 
    const totalPriceInCent = total * 100;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Room Booking',
            },
            unit_amount: totalPriceInCent,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel?session_id={CHECKOUT_SESSION_ID}`,
    });

    // Save the payment data
    const newPayment = new Payment({
      booking: booking._id,
      price: total,
      stripeSessionId: session.id,
      status: 'pending',
    });
    await newPayment.save();

    // Update booking with session ID
    booking.stripeSessionId = session.id;
    await booking.save();

    res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create payment session',
      error: error.message,
    });
  }
};


export const updatePaymentStatus = async (req, res) => {
  const { stripeSessionId } = req.query;

  if (!stripeSessionId) {
    return res.status(400).json({ success: false, message: 'stripeSessionId is required.' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(stripeSessionId);

    let paymentStatus = session?.payment_status === 'paid' ? 'paid' : 'failed';

    // Update Payment record
    const payment = await Payment.findOneAndUpdate(
      { stripeSessionId },
      { status: paymentStatus },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found.' });
    }

    // Update Booking status and payment status
    const booking = await Booking.findByIdAndUpdate(
      payment.booking,
      {
        status: paymentStatus === 'paid' ? 'confirmed' : 'cancelled',
        paymentStatus: paymentStatus,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `Payment marked as ${paymentStatus}.`,
      data: {
        payment,
        booking,
      },
    });
  } 
  catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status',
      error: error.message,
    });
  }
};
