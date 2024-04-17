import express from "express";
const router = express.Router();

// import controllers and middlewares
import * as orderControllers from "../controllers/orderController.js";

// define routes
router.route('/').post(orderControllers.createOrder);

// export router
export default router;
