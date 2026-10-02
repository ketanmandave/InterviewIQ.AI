import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.routes.js";
import { ApiError } from "./utils/apiError.js";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);









app.get("/", (req, res) => {
    res.send("Welcome to the InterviewIQ API");
});

// Keep every controller error in the same JSON format for the frontend.
app.use((error, req, res, next) => {
    const statusCode = error instanceof ApiError ? error.statusCode : 500;

    return res.status(statusCode).json({
        success: false,
        message: error.message || "Internal Server Error",
        errors: error.errors || [],
    });
});

export default app;
