import express from 'express'
import { payment } from './payment.controller.js'
// import { stripeWebhook } from './webHook.controller.js'

const router = express.Router()

router.post('/payment-intent', payment)

// router.get('/payment/status-check', updatePaymentStatus)
// router.post('/webhook', stripeWebhook);

export default router