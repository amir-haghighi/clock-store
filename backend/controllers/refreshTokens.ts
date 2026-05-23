import type { NextFunction, Response } from "express";
import { RefreshToken } from "../models/refreshTokenModel.js";
import jwt, { type JwtPayload } from "jsonwebtoken";

export const refreshAccessToken = async (req: any, res: Response) => {
    try {
        const token = req.cookies.refreshToken;

        if (!token) {
            return res.status(401).json({ message: "No refresh token" });
        }

        const stored = await RefreshToken.findOne({ token });

        if (!stored) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        const decoded: any = jwt.verify(token, process.env.REFRESH_SECRET!);

        const newAccessToken = jwt.sign(
            { id: decoded.id },
            process.env.JWT_SECRET!,
            { expiresIn: "15m" }
        );

        res.json({
            accessToken: newAccessToken,
        });
    } catch (err) {
        res.status(401).json({ message: "Refresh failed" });
    }
};


export const refreshRefreshToken = async (
    req: any,
    res: Response,
    next: NextFunction
) => {

    try {

        // old refresh token from cookie
        const oldRefreshToken = req.cookies.refreshToken;

        if (!oldRefreshToken) {
            return res.status(401).json({
                status: "fail",
                message: "No refresh token"
            });
        }

        // verify token
        const decoded = jwt.verify(
            oldRefreshToken,
            process.env.REFRESH_SECRET!
        ) as JwtPayload;

        // find stored token
        const storedToken = await RefreshToken.findOne({
            userId: decoded.id
        });

        if (!storedToken) {
            return res.status(401).json({
                status: "fail",
                message: "Invalid refresh token"
            });
        }

        // check exact token match
        if (storedToken.token !== oldRefreshToken) {

            // possible token reuse attack
            await RefreshToken.deleteOne({
                userId: decoded.id
            });

            return res.status(401).json({
                status: "fail",
                message: "Refresh token reuse detected"
            });
        }

        // create new access token
        const accessToken = jwt.sign(
            { id: decoded.id },
            process.env.JWT_SECRET!,
            {
                expiresIn: process.env.JWT_EXPIRES!
            }
        );

        // create new refresh token
        const newRefreshToken = jwt.sign(
            { id: decoded.id },
            process.env.REFRESH_SECRET!,
            {
                expiresIn: "7d"
            }
        );

        // rotate refresh token
        storedToken.token = newRefreshToken;

        storedToken.expiresAt = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        );

        await storedToken.save();

        // set new cookie
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        // send new access token
        return res.status(200).json({
            status: "success",
            accessToken
        });

    } catch (error: any) {

        return res.status(403).json({
            status: "fail",
            message: error.message || "Invalid refresh token"
        });

    }

};