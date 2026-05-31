import mongoose, { Schema, Types, Document } from "mongoose";

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface IReview {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
    name: string;
    rating: number;
    comment: string;
    createdAt: Date;
}

export interface IProduct extends Document {
    title: string;
    slug: string;
    brand: string;
    watchModel: string;
    description: string;
    images: string[];
    updateRating(): void;
    price: number;
    discountPrice?: number;     // قیمت تخفیف — اگه ۰ باشه تخفیفی نیست
    stock: number;
    category: "luxury" | "sport" | "casual" | "smart" | "classic";
    gender: "men" | "women" | "unisex";
    colors: { name: string; hex: string }[];
    specifications: Map<string, string>;  // آزاد — هر چیزی که فروشنده بخواد
    reviews?: IReview[];
    rating?: number;
    numReviews?: number;
    isFeatured: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

const reviewSchema = new Schema<IReview>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: true }
);

// ─── Main schema ──────────────────────────────────────────────────────────────

const productSchema = new Schema<IProduct>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        brand: {
            type: String,
            required: true,
            trim: true,
        },
        watchModel: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        images: {
            type: [String],
            required: true,
            validate: {
                validator: (v: string[]) => v.length > 0,
                message: "حداقل یک تصویر الزامی است",
            },
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        discountPrice: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
        stock: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        category: {
            type: String,
            enum: ["luxury", "sport", "casual", "smart", "classic"],
            required: true,
        },
        gender: {
            type: String,
            enum: ["men", "women", "unisex"],
            required: true,
        },
        colors: [
            {
                name: { type: String, required: true },
                hex: { type: String, required: true },
            },
        ],
        // فروشنده هر مشخصه‌ای که خواست اضافه می‌کنه
        // مثلا: { "بند": "چرم", "موومان": "Miyota 9015", "گارانتی": "۲ سال" }
        specifications: {
            type: Map,
            of: String,
            default: {},
        },
        reviews: {
            optional: true,
            type: [reviewSchema],
            default: [],
        },
        rating: {
            optional: true,
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        numReviews: {
            optional: true,
            type: Number,
            default: 0,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

productSchema.index({ brand: 1, category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isActive: 1, isFeatured: 1 });
productSchema.index(
    { title: "text", brand: "text", model: "text" },
    { weights: { title: 3, brand: 2, model: 1 } }
);

// ─── Virtuals ─────────────────────────────────────────────────────────────────

// قیمت بعد از تخفیف
productSchema.virtual("finalPrice").get(function () {
    if (!this.discountPrice) return this.price;
    return (this.discountPrice);
});

productSchema.virtual("inStock").get(function () {
    return this.stock > 0;
});

// ─── Methods ──────────────────────────────────────────────────────────────────

productSchema.methods.updateRating = function () {
    if (this.reviews.length === 0) {
        this.rating = 0;
        this.numReviews = 0;
    } else {
        const sum = this.reviews.reduce((acc: number, r: IReview) => acc + r.rating, 0);
        this.rating = parseFloat((sum / this.reviews.length).toFixed(1));
        this.numReviews = this.reviews.length;
    }
};

// ─── Model ────────────────────────────────────────────────────────────────────
const Product = (mongoose.models.Product as mongoose.Model<IProduct>) ||
    mongoose.model<IProduct>("Product", productSchema);
export default Product;
