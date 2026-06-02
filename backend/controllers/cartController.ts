import type { Request } from "express";
import type { ResType } from "../types/res.js";
import { Cart } from "../models/cartSchema.js";

export const getCart = async (req: Request, res: ResType) => {
    const userId = req.user._id as string;

    let cart = await Cart.findOne({ userId: userId });

    if (!cart) {
        cart = await Cart.create({
            user: userId,
            items: [],
        });
    }

    res.status(200).json({
        message: "successFully gotten the cart",
        status: "success",
        data: cart
    })
};

export const addToCart = async (req: Request, res: ResType) => {
    const userId = req.user._id;

    const {
        productId,
        quantity,
        selectedColor,
    } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found",
        });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = await Cart.create({
            user: userId,
            items: [],
        });
    }

    const existingItem = cart.items.find(
        (item) =>
            item.product.toString() === productId &&
            item.selectedColor?.name === selectedColor?.name
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.items.push({
            product: product._id,

            title: product.title,
            image: product.image,
            slug: product.slug,
            brand: product.brand,

            quantity,
            selectedColor,

            price: product.price,
            discountPrice: product.discountPrice,
        });
    }

    await cart.save();

    res.status(200).json({
        message: "The document saved ",
        status: "success",
        data: cart
    })
};
export const updateCartItem = async (req, res) => {
    const userId = req.user._id;

    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({
        user: userId,
    });

    if (!cart) {
        return res.status(404).json({
            success: false,
            message: "Cart not found",
        });
    }

    const item = cart.items.find(
        (i) => i.product.toString() === productId
    );

    if (!item) {
        return res.status(404).json({
            success: false,
            message: "Item not found",
        });
    }

    item.quantity = quantity;

    await cart.save();

    res.status(200).json({
        success: true,
        cart,
    });
};
export const removeCartItem = async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params;

    const cart = await Cart.findOne({
        user: userId,
    });

    if (!cart) {
        return res.status(404).json({
            success: false,
            message: "Cart not found",
        });
    }

    cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
    );

    await cart.save();

    res.status(200).json({
        success: true,
        cart,
    });
};
export const clearCart = async (req, res) => {
    const userId = req.user._id;

    const cart = await Cart.findOne({
        user: userId,
    });

    if (!cart) {
        return res.status(404).json({
            success: false,
            message: "Cart not found",
        });
    }

    cart.items = [];

    await cart.save();

    res.status(200).json({
        success: true,
        message: "Cart cleared",
    });
};