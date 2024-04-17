import pool from "../config/db.js";
import { asyncHandler } from "../util/asyncHandler.js";
import ErrorHandler from "../util/errorHandler.js";


export const createOrder = asyncHandler(async (req, res, next) => {
    const { user_id, shipping_address, grand_total, payment_status, order_items } = req.body;

    if (!user_id || !shipping_address || !grand_total || !payment_status || !order_items.length) {
        return next(new ErrorHandler(400, "Provide all necessary data."));
    }

    // create order
    const [response] = await pool.query(
        "INSERT INTO Orders (user_id, shipping_address, grand_total, payment_status) VALUES (?, ?, ?, ?)",
        [user_id, shipping_address, grand_total, payment_status]
    );

    // insert order items to join table OrerToProduct
    for (const item of order_items) {
        const insertSql = `INSERT INTO OrderToProduct (order_id, product_id, quantity) values (?, ?, ?)`;
        const [updateResult] = await pool.query(insertSql, [response.insertId, item.id, item.quantity]);

        if (updateResult.affectedRows === 0) {
            return next(new ErrorHandler(400, `Product with id ${item.id} not found or insufficient stock`));
        }
    }

    // decrement the stock of each product
    for (const item of order_items) {
        const updateStockSql = `UPDATE Product SET stock = stock - ? WHERE id = ?`;
        const [updateResult] = await pool.query(updateStockSql, [item.quantity, item.id]);
      
        if (updateResult.affectedRows === 0) {
          throw new ErrorHandler(400, `Product with id ${item.id} not found or insufficient stock`);
        }
      }      


    res.status(201).json({
        success: true,
        
    });
});