
import express from "express";
import {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    updateOrderStatus,
} from "../controllers/orderController.js";
import { isUserAdmin, protect } from "../controllers/protectController.js"; ``

const orderRouter = express.Router();

// USER
orderRouter.post("/", protect, createOrder);
orderRouter.get("/my-orders", protect, getMyOrders);
orderRouter.get("/:id", protect, getOrderById);
orderRouter.patch("/:id/cancel", protect, cancelOrder);

// ADMIN
orderRouter.patch("/:id/status", protect, isUserAdmin, updateOrderStatus);


export default orderRouter