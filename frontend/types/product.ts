export type ReviewType = {
    _id: string;
    user: string;
    name: string;
    rating: number;
    comment: string;
    createdAt: string;
};

export type VariantType = {
    _id: string;
    color: {
        name: string;
        hex: string;
    };
    price: number;
    discountPrice?: number;
    stock: number;
};

export type ProductType = {
    _id: string;
    title: string;
    slug: string;
    brand: string;
    watchModel: string;
    description: string;
    images: string[];

    variants: VariantType[];

    category:
    | "luxury"
    | "sport"
    | "casual"
    | "smart"
    | "classic";
    gender:
    | "men"
    | "women"
    | "unisex";

    specifications: Record<string, string>;

    reviews: ReviewType[];

    rating: number;
    numReviews: number;

    isFeatured: boolean;
    isActive: boolean;

    createdAt: string;
    updatedAt: string;
};