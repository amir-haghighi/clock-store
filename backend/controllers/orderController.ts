import type { Request } from "express";
import { User } from "../models/userModel.js";
import type { ResType } from "../types/res.js";
import Order from "../models/orderSchema.js";

export const getOrder = async (req: Request, res: ResType) => {
    try {

        const user = await User.find()
        res.status(200).json({
            message: "getting all the products was successful",
            status: "success",
            data: user
        })
    } catch (error) {
        res.status(400).json({
            message: error?.message ?? error,
            status: "fail"
        })
    }


}
export const postOrder = async (req: Request, res: ResType) => {
    const { body } = req
    try {
        const newOrder = await Order.create({
            items: {
                product: body.product,
                title: body.title,
                image: body.image,
                price: body.price,
                quantity: body.quantity,
                selectedColor: body.selectedColor,
                selectedSize: body.selectedSize,
            },

        })
        const user = await User.find()
        res.status(200).json({
            message: "getting all the products was successful",
            status: "success",
            data: user
        })
    } catch (error) {
        res.status(400).json({
            message: error?.message ?? error,
            status: "fail"
        })
    }


}
