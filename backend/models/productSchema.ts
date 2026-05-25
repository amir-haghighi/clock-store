import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
            required: true,
        },

        discountPrice: {
            type: Number,
            default: null,
        },

        images: [
            {
                type: String,
            },
        ],

        brand: {
            type: String,
            default: "unknown",
        },

        category: {
            type: String,
            default: "watch",
        },

        stock: {
            type: Number,
            default: 0,
        },

        rating: {
            type: Number,
            default: 0,
        },

        numReviews: {
            type: Number,
            default: 0,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);