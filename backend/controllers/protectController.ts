import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import type { ResType } from "../types/res.js";
export const protect = async (
    req: any,
    res: ResType,
    next: NextFunction
) => {
    try {


        // get token from http only cookie
        const token = req.cookies.accessToken;

        // check token exists
        if (!token) {
            return res.status(401).json({
                status: "fail",
                message: "You are not logged in",
            });
        }

        // verify token
        const decoded: any = jwt.verify(
            token,
            process.env.JWT_SECRET!
        );

        // find user
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                status: "fail",
                message: "User no longer exists",
            });
        }

        // attach user to request
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
export const isUserAdmin = (req: any, res: ResType, next: NextFunction) => {
    req.user.role === "admin" ?
        next() :
        res.status(403).json({
            status: "fail",
            message: "Forbidden"
        });

}