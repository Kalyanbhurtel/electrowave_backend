import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import ErrorHandler from "../util/errorHandler.js";
import { asyncHandler } from "../util/asyncHandler.js";

// registerUser
export const registerUser = asyncHandler(async (req, res, next) => {
    const { role, name, phone, password, email, company_name, company_phone, company_email } = req.body;
    if (!role || !name || !phone || !email || !password) {
        return next(new ErrorHandler(400, "Please fill all the required fields"));
    }

    if (role !== "wholesaler" && role !== "consumer" && role !== "admin") {
        return next(new ErrorHandler(400, "Invalid role"));
    }


    if (role === "wholesaler") {
        if (!company_name || !company_phone || !company_email) {
            return next(new ErrorHandler(400, "Please fill all the required fields"));
        }
    }

    // check if user exists
    const [rows] = await pool.query("SELECT * FROM User WHERE phone = ? OR email = ?", [phone, email]);

    if (rows.length > 0) {
        return next(new ErrorHandler(400, `User with phone ${phone} or email ${email} already exists`));
    }

    // create user
    const [result] = await pool.query(
        "INSERT INTO User (role, name, phone, email, password, company_name, company_phone, company_email) VALUES (?, ?, ?, ?, ?, ?, ?,?)",
        [role, name, phone, email, password, company_name, company_phone, company_email]
    );

    // fetch the registered user
    const [user] = await pool.query("SELECT * FROM User WHERE id = ?", [result.insertId]);
    const jwt_token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: "2d" });

    // response
    res.status(201).json({
        status: "success",
        message: "User registered successfully",
        data: {
            user: user[0],
            jwt_token
        },
    });
});


// loginUser
export const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler(400, "Please fill all the required fields"));
    }

    // check if user exists
    const [rows] = await pool.query("SELECT * FROM User WHERE email = ?", [email]);

    if (rows.length === 0) {
        return next(new ErrorHandler(400, `User with email: ${email} does not exist.`));
    }

    // check if password is correct
    if (rows[0].password !== password) {
        return next(new ErrorHandler(400, "Invalid credentials"));
    }

    const jwt_token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET, { expiresIn: "2d" });
    // response
    res.status(200).json({
        status: "success",
        message: "User Login successfully",
        data: {
            user: rows[0],
            jwt_token
        },
    });
});


// logoutUser
export const logoutUser = asyncHandler(async (req, res, next) => {
    res.clearCookie('jwt_token'); // Example for clearing a cookie named 'jwt_token'

    // Respond with success message
    res.status(200).json({
        status: "success",
        message: "User logged out successfully",
    });
});
