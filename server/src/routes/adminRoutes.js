import express from "express";
const router = express.Router();

// import controllers and middlewares
import * as adminController from "../controllers/adminController.js";
import { uploadSingle } from "../middlewares/multerMiddleware.js";

// define routes
router.route('/dashboard').get(adminController.getDashboardData)
router.route('/users').get(adminController.getUsers)
router.route('/orders').get(adminController.getOrders)
router.route('/orders/:id').patch(adminController.updateOrder)
router.route('/users/:id').delete(adminController.deleteUser)
router.route('/products').get(adminController.getProducts)
router.route('/products').post(uploadSingle, adminController.addProduct);
router.route('/products/:id').patch(adminController.updateProduct);
router.route('/products/:id').delete(adminController.deleteProduct);


// export 
export default router;
