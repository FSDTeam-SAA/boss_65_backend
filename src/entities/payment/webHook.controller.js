import Stripe from 'stripe';
import { Payment } from '../payment/payment.model.js';
import Booking from '../booking/booking.model.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;

        const payment = await Payment.findOne({ stripeSessionId: session.id }).populate('booking');
        if (payment) {
          payment.paymentStatus = 'paid';
          payment.transactionId = session.payment_intent;
          payment.paymentDate = new Date();
          await payment.save();

          if (payment.booking) {
            payment.booking.paymentStatus = 'paid';
            payment.booking.status = 'confirmed';
            await payment.booking.save();
          }
        }
        break;
      }

      case 'charge.refunded': {
        const refund = event.data.object.refunds.data[0];
        const charge = event.data.object;

        const payment = await Payment.findOne({ transactionId: charge.payment_intent });
        if (payment) {
          payment.paymentStatus = 'refunded';
          payment.refundId = refund.id;
          await payment.save();

          const booking = await Booking.findById(payment.booking);
          if (booking) {
            booking.paymentStatus = 'refunded';
            booking.refundedAt = new Date();
            booking.refundId = refund.id;
            await booking.save();
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook handler failed:', error);
    res.status(500).send('Internal Server Error');
  }
};
