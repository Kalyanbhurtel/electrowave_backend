import { v2 as cloudinary } from "cloudinary";
import { asyncHandler } from "../util/asyncHandler.js";
import ErrorHandler from "../util/errorHandler.js";
import pool from "../config/db.js";

// get dashboard data
export const getDashboardData = asyncHandler(async (req, res, next) => {
    const [products] = await pool.query("SELECT COUNT(*) AS totalProducts FROM Product");
    const [users] = await pool.query("SELECT COUNT(*) AS totalUsers FROM User");
    const [orders] = await pool.query("SELECT COUNT(*) AS totalOrders FROM Orders");

    // response
    res.status(200).json({
        success: true,
        message: "Dashboard data fetched successfully",
        data: {
            totalProducts: products[0].totalProducts,
            totalUsers: users[0].totalUsers,
            totalOrders: orders[0].totalOrders
        }
    });
});

// add prooduct
export const addProduct = asyncHandler(async (req, res, next) => {
    const { name, price, description, stock, discount, category } = req.body;

    if (!name || !price || !description || !stock || !category) {
        return next(new ErrorHandler(400, "Please fill in all required fields."));
    }

    // image file
    const imageFile = req.file;
    if (!imageFile) {
        return next(new ErrorHandler(400, "Please provide an image"));
    }

    // insert imageFile in cloudinary 
    const extname = imageFile.originalname.split(".")[1];
    const img = `data:image/${extname};base64,${imageFile.buffer.toString("base64")}`;
    const response = await cloudinary.uploader.upload(img, {
        folder: 'Ecommerce/Products'
    })

    // create product
    await pool.query(
        "INSERT INTO Product (name, price, description, category, stock, discount, image_url, image_public_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [name, price, description, category, stock, discount, response.secure_url, response.public_id]
    );

    // response
    res.status(201).json({
        success: true,
        message: "Product added successfully"
    });
});


// update product
export const updateProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name, price, description, stock, discount, category } = req.body;

    if (!name || !price || !description || !stock || !category) {
        return next(new ErrorHandler(400, "Please fill in all required fields."));
    }

    // check if product exists
    const [row] = await pool.query("SELECT * FROM Product WHERE id=?", [id]);
    if (row.length === 0) {
        return next(new ErrorHandler(404, "Product not found"));
    }

    // update product
    await pool.query(
        "UPDATE Product SET name=?, price=?, description=?, stock=?, discount=?, category=? WHERE id=?",
        [name, price, description, stock, discount, category, id]
    );

    // response
    res.status(200).json({
        success: true,
        message: "Product updated successfully"
    });
});

// delete product
export const deleteProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // check if product exists
    const [row] = await pool.query("SELECT * FROM Product WHERE id=?", [id]);
    if (row.length === 0) {
        return next(new ErrorHandler(404, "Product not found"));
    }

    // delete product
    await pool.query("DELETE FROM Product WHERE id=?", [id]);

    // delete image from cloudinary
    await cloudinary.uploader.destroy(row[0].image_public_id);

    // response
    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    });
});

// get products
export const getProducts = asyncHandler(async (req, res, next) => {
    const [rows] = await pool.query("SELECT * FROM Product");

    // response
    res.status(200).json({
        success: true,
        message: "Product fetched successfully",
        data: {
            products: rows
        }
    });
});

// get users
export const getUsers = asyncHandler(async (req, res, next) => {
    const [rows] = await pool.query("SELECT * FROM User");

    // response
    res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: {
            users: rows
        }
    });
})

// delete user
export const deleteUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const [result] = await pool.query("DELETE FROM User WHERE id = ?", [id]);

    if (result.affectedRows !== 1) {
        res.status(404).json({
            success: false,
            error: 'User not found'
        });
    }

    res.status(200).json({
        success: true,
        message: 'User deleted successfully'
    });
});


// get orders
export const getOrders = asyncHandler(async (req, res, next) => {
    const [rows] = await pool.query("SELECT * FROM Orders");

    // response
    res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: {
            orders: rows
        }
    });
})


// update order
export const updateOrder = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const updateResult = await pool.query("UPDATE Orders SET order_status=? WHERE id=?", ['dispatched', id])
    
    if (updateResult.affectedRows === 0) {
        return next(new ErrorHandler(400, "Order not found or update failed"));
    }

    res.status(200).json({
        success: true,
        message: "Order updated successfully"
    });
})
