import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const protect = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        // Authorization: Bearer TOKEN
        const authHeader = req.headers.authorization;
        // check header exists
        if (!authHeader) {
            return res.status(401).json({
                status: "fail",
                message: "You are not logged in",
            });
        }

        // check bearer format
        if (!authHeader.startsWith("Bearer")) {
            return res.status(401).json({
                status: "fail",
                message: "Invalid token format",
            });
        }

        // extract token
        const token = authHeader.split(" ")[1];

        const decoded = await jwt.verify(
            token,
            process.env.JWT_SECRET!
        );

        // attach user payload to request
        const user = await User.findById(decoded.id)
        console.log("user", user)
        req.user = user;

        next();

    } catch (error: any) {
        // token expired
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                status: "fail",
                message: "Token expired",
            });
        }

        // invalid token
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                status: "fail",
                message: "Invalid token",
            });
        }

        return res.status(500).json({
            status: "fail",
            message: "Authentication failed",
        });
    }
};
export const isUserAdmin = (req: any, res: Response, next: NextFunction) => {
    console.log(req.user)
    req.user.role === "admin" ?
        next() :
        res.status(403).json({
            status: "fail",
            message: "Forbidden"
        });

}