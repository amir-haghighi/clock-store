import mongoose, { Schema, Types, Document } from "mongoose";

export interface IOrderItem {
    product: Types.ObjectId;
    title: string;
    image: string;

    price: number;
    quantity: number;

    selectedColor?: string;
    selectedSize?: string;
}

export interface IShippingAddress {
    fullName: string;
    phone: string;
    country: string;
    city: string;
    address: string;
    postalCode?: string;
}

export interface IOrder extends Document {
    user: Types.ObjectId;
    items: IOrderItem[];
    shippingAddress: IShippingAddress;
    paymentMethod: "card" | "cash" | "crypto";
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
    isPaid: boolean;
    paidAt?: Date;
    isDelivered: boolean;
    deliveredAt?: Date;
    status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";

    trackingCode?: string;
    createdAt: Date;
    updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        title: {
            type: String,
            required: true,
        },

        image: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
            required: true,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },

        selectedColor: {
            type: String,
        },

        selectedSize: {
            type: String,
        },
    },
    {
        _id: false,
    }
);

const shippingAddressSchema = new Schema<IShippingAddress>(
    {
        fullName: {
            type: String,
            required: true,
        },

        phone: {
            type: String,
            required: true,
        },

        country: {
            type: String,
            required: true,
        },

        city: {
            type: String,
            required: true,
        },

        address: {
            type: String,
            required: true,
        },

        postalCode: {
            type: String,
        },
    },
    {
        _id: false,
    }
);

const orderSchema = new Schema<IOrder>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: {
            type: [orderItemSchema],
            required: true,
        },

        shippingAddress: {
            type: shippingAddressSchema,
            required: true,
        },

        paymentMethod: {
            type: String,
            enum: ["card", "cash", "crypto"],
            required: true,
        },

        itemsPrice: {
            type: Number,
            required: true,
            default: 0,
        },

        shippingPrice: {
            type: Number,
            required: true,
            default: 0,
        },

        taxPrice: {
            type: Number,
            required: true,
            default: 0,
        },

        totalPrice: {
            type: Number,
            required: true,
            default: 0,
        },

        isPaid: {
            type: Boolean,
            default: false,
        },

        paidAt: {
            type: Date,
        },

        isDelivered: {
            type: Boolean,
            default: false,
        },

        deliveredAt: {
            type: Date,
        },

        status: {
            type: String,
            enum: [
                "pending",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
            ],
            default: "pending",
        },

        trackingCode: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Order =
    mongoose.models.Order ||
    mongoose.model<IOrder>("Order", orderSchema);

export default Order;