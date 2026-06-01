import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { RefreshToken } from "../models/refreshTokenModel.js";
import type { ResType } from "../types/res.js";

export const refreshAccessToken = async (
    req: any,
    res: ResType
) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                status: "fail",
                message: "No refresh token provided",
            });
        }

        // Verify JWT signature & expiration
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_SECRET!
        ) as { id: string };

        // Check token exists in database
        const storedToken = await RefreshToken.findOne({
            token: refreshToken,
        });

        if (!storedToken) {
            return res.status(401).json({
                status: "fail",
                message: "Invalid refresh token",
            });
        }

        // Optional: check DB expiration field if your model has one
        if (
            storedToken.expiresAt &&
            storedToken.expiresAt < new Date()
        ) {
            await RefreshToken.deleteOne({
                _id: storedToken._id,
            });

            return res.status(401).json({
                status: "fail",
                message: "Refresh token expired",
            });
        }

        // Make sure user still exists
        const user = await User.findById(decoded.id).select(
            "_id role"
        );

        if (!user) {
            await RefreshToken.deleteOne({
                _id: storedToken._id,
            });

            return res.status(401).json({
                status: "fail",
                message: "User no longer exists",
            });
        }

        // Create new access token
        const accessToken = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: "15m",
            }
        );

        // Cookie lifetime matches JWT lifetime
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        return res.status(200).json({
            status: "success",
            message: "Access token refreshed successfully",
        });

    } catch (error: any) {

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                status: "fail",
                message: "Refresh token expired",
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                status: "fail",
                message: "Invalid refresh token",
            });
        }

        return res.status(500).json({
            status: "fail",
            message: "Failed to refresh access token",
        });
    }
};