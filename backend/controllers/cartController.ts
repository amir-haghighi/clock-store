import type { Request } from "express";
import type { ResType } from "../types/res.js";
import { Cart, type ICartItem } from "../models/cartSchema.js";
import Product from "../models/productSchema.js";

// GET /api/cart
export const getCart = async (req: Request, res: ResType) => {
    const userId = req.user._id;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
        cart = await Cart.create({ userId, items: [] });
    }

    res.status(200).json({
        status: "success",
        message: "Getting cart data was successful",
        data: cart,
    });
};

// POST /api/cart/items
export const addToCart = async (req: Request, res: ResType) => {
    const userId = req.user._id;
    const { productId, quantity, selectedColor } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
        return res.status(404).json({
            status: "fail",
            message: "Product not found",
        });
    }

    let serverCart = await Cart.findOne({ userId });

    if (!serverCart) {
        serverCart = await Cart.create({ userId, items: [] });
    }

    const existingItem = serverCart.items.find(
        (item) =>
            item.productId.toString() === productId &&
            item.selectedColor?.name === selectedColor?.name
    );

    if (existingItem) {
        existingItem.quantity = Math.min(quantity + existingItem.quantity, product.stock);
        existingItem.updatedAt = new Date(); // backend owns time
    } else {
        serverCart.items.push({
            productId: product._id,
            title: product.title,
            image: product.images[0],
            slug: product.slug,
            brand: product.brand,
            price: product.price,
            discountPrice: product.discountPrice,
            quantity,
            selectedColor,
            updatedAt: new Date()
        });
    }

    await serverCart.save();

    res.status(200).json({
        message: "Adding to cart was successful",
        status: "success",
        data: serverCart,
    });
};

// PATCH /api/cart/items/:productId
export const updateCartItem = async (req: Request, res: ResType) => {
    const userId = req.user._id;
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
        return res.status(404).json({ status: "fail", message: "Cart not found" });
    }

    const item = cart.items.find((i) => i.productId.toString() === productId);

    if (!item) {
        return res.status(404).json({ status: "fail", message: "Item not found" });
    }

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({ status: "success", data: cart, message: "Updating the cart was successful" });
};

// DELETE /api/cart/items/:productId
export const removeCartItem = async (req: Request, res: ResType) => {
    const userId = req.user._id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
        return res.status(404).json({ status: "fail", message: "Cart not found" });
    }

    cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId
    );

    await cart.save();

    res.status(200).json({ status: "success", data: cart, message: "Removing the cart was successful" });
};

// DELETE /api/cart
export const clearCart = async (req: Request, res: ResType) => {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
        return res.status(404).json({ status: "fail", message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({ status: "success", message: "Cart cleared" });
};

// POST /api/cart/merge  ← جدید، هنگام login صدا زده میشه
// POST /api/cart/merge
export const mergeCart = async (req: Request, res: ResType) => {
    const userId = req.user._id;

    const localItems: ICartItem[] = req.body.items ?? [];

    let dbCart = await Cart.findOne({ userId });

    if (!dbCart) {
        dbCart = new Cart({ userId, items: [] });
    }

    // key generator
    const getKey = (item: ICartItem) =>
        `${item.productId.toString()}-${item.selectedColor?.name ?? "default"}`;

    // server cart → map
    const map = new Map<string, ICartItem>();

    for (const item of dbCart.items ?? []) {
        map.set(getKey(item), { ...item });
    }

    // fetch products once
    const productIds = localItems.map(i => i.productId);

    const products = await Product.find({
        _id: { $in: productIds }
    });

    const productMap = new Map(
        products.map(p => [p._id.toString(), p])
    );

    // merge logic
    for (const localItem of localItems) {

        const product = productMap.get(localItem.productId.toString());
        const { stock } = product?.variants.find(
            (variant) => variant?.color?.name === localItem?.selectedColor?.name

        );

        if (!product) continue;

        const key = getKey(localItem);
        const existing = map.get(key);

        if (!existing) {
            map.set(key, {
                ...localItem,
                quantity: Math.min(localItem.quantity, stock)
            });
            continue;
        }

        const newQty = Math.min(
            existing.quantity + localItem.quantity,
            product.stock
        );

        map.set(key, {
            ...existing,
            quantity: newQty
        });

        if (newQty <= 0) {
            map.delete(key);
        }
    }

    cart.items = Array.from(map.values());
    if (!cart?.items?.length) {
        await Cart.deleteOne({ userId });

        return res.status(200).json({
            status: "success",
            data: null,
            message: "Cart deleted because it was empty",
        });
    } await cart.save();

    return res.status(200).json({
        status: "success",
        data: cart,
        message: "Cart merged successfully",
    });
};


