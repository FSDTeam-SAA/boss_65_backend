import Stripe from 'stripe';
import Booking from '../booking/booking.model.js';
import { Payment } from './payment.model.js';


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
    console.error('❌ Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;

        // Update Payment status
        const payment = await Payment.findOneAndUpdate(
            { stripeSessionId: session.id },
            {
              paymentStatus: 'paid',
              paymentIntentId: session.payment_intent,
            },
          
        
          { new: true }
        );

        if (!payment) {
          console.warn('⚠️ Payment not found for session:', session.id);
          break;
        }

        // Update Booking status
        await Booking.findByIdAndUpdate(
          payment.booking,
          {
            status: 'confirmed',
            paymentStatus: 'paid',
          },
          
          { new: true }
        );

        console.log(`✅ Booking ${payment.booking} confirmed via webhook`);
        break;
      }

      case 'charge.refunded':
        case 'refund.updated':
        case 'refund.succeeded': {
          const object = event.data.object;
          const paymentIntentId = object.payment_intent;
  
          if (!paymentIntentId) {
            console.warn(`⚠️ No paymentIntentId in event: ${event.type}`);
            break;
          }
  
          const payment = await Payment.findOneAndUpdate(
            { paymentIntentId },
            { paymentStatus: 'refunded' },
            { new: true }
          );
  
          if (!payment) {
            console.warn('⚠️ Refunded payment not found for intent:', paymentIntentId);
            break;
          }
  
          await Booking.findByIdAndUpdate(
            payment.booking,
            {
              status: 'cancelled',
              paymentStatus: 'refunded',
            },
            { new: true }
          );
  
          console.log(`💸 Booking ${payment.booking} refunded via ${event.type}`);
          break;
        }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('❌ Error in webhook processing:', err);
    res.status(500).send('Webhook handler error');
  }
};
