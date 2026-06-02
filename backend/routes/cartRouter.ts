import express from "express";

import {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
} from "../controllers/cartController.js";
import { protect } from "../controllers/protectController.js";


const cartRouter = express.Router();

cartRouter.use(protect);

cartRouter.get("/", getCart);

cartRouter.post("/items", addToCart);

cartRouter.patch("/items/:productId", updateCartItem);

cartRouter.delete("/items/:productId", removeCartItem);

cartRouter.delete("/", clearCart);

export default cartRouter;