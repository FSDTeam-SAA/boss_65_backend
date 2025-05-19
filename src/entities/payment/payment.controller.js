import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
import Booking from '../booking/booking.model.js'
import { Payment } from './payment.model.js'

export const payment = async (req, res) => {
  const { booking, price } = req.body

  if ( !booking || !price) {
    return res
      .status(400)
      .json({ success: false, message: 'All fields are required.' })
  }

  try {
    const totalPriceInCent = price * 100

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Purchase',
            },
            unit_amount: totalPriceInCent,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel?session_id={CHECKOUT_SESSION_ID}`,
    })

    // Save the payment data
    const newPayment = new Payment({
      booking,
      price,
      stripeSessionId: session.id,
      status: 'pending',
    })
    await newPayment.save()

    res.status(200).json({ success: true, url: session.url })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create payment session',
      error: error.message,
    })
  }
}

export const updatePaymentStatus = async (req, res) => {
  const { stripeSessionId } = req.query

  if (!stripeSessionId) {
    return res.status(400).json({
      success: false,
      message: 'stripeSessionId is required.',
    })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(stripeSessionId)

    let paymentStatus
    if (session && session.payment_status === 'paid') {
      paymentStatus = 'complete'
    } else {
      paymentStatus = 'failed'
    }
    //console.log(stripeSessionId)

    // Update payment info
    const payment = await Payment.findOneAndUpdate(
      { stripeSessionId },
      { status: paymentStatus },
      { new: true }
    )

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found.',
      })
    }

    // Find and update billing info by user and auction
    const billing = await Booking.findOneAndUpdate(
      {
        _id: payment.booking,
      },
      {
        status: paymentStatus === 'complete' ? 'paid' : 'unpaid',
      },
      { new: true }
    )

    res.status(200).json({
      success: true,
      message: `Payment marked as ${paymentStatus}.`,
      data: {
        payment,
        billing,
      },
    })
  } catch (error) {
    console.error('Error updating payment status:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status',
      error: error.message,
    })
  }
}