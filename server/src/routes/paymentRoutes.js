import express from "express";
const router = express.Router();

// import controllers and middlewares
import * as paymentController from "../controllers/paymentController.js";

// routes
router.route('/stripe-publishable-key').get(paymentController.getStripePK);
router.route('/create-payment-intent').get(paymentController.createPaymentIntent);

// export
export default router;