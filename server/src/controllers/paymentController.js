import Stripe from 'stripe'
import { asyncHandler } from '../util/asyncHandler.js';

// publishable key
export const getStripePK = asyncHandler(async (req, res, next) => {
    res.status(200).json({ stripePK: process.env.STRIPE_PUBLISHABLE_KEY });
})

// create intent
export const createPaymentIntent = asyncHandler(async (req, res, next) => {
    const { amount, email } = req.body;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const intent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: 'npr',
        payment_method_types: ['card'],
        receipt_email: email
    });

    res.status(200).json({
        success: true,
        client_secret: intent.client_secret
    });
})