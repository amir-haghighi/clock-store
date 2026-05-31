import { Router } from "express";
import jwt from "jsonwebtoken";
import {
    getFeaturedProducts,
    getProductBySlug,
    createProductReview,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteReview,
    getProducts,
} from "../controllers/productController.js";
import { isUserAdmin, protect } from "../controllers/protectController.js";
import { upload } from "../middlewares/multer.js";

const router = Router();

// ─── Types ────────────────────────────────────────────────────────────────────

interface JwtPayload {
    _id: string;
    name: string;
    role: "user" | "admin";
}


// ─── Public Routes ────────────────────────────────────────────────────────────

/**
 * GET /api/products
 * پارامترها: brand, category, gender, minPrice, maxPrice,
 *            inStock, search, sort, page, limit
 */
router.get("/", getProducts);

/**
 * GET /api/products/featured
 * محصولات ویژه صفحه اصلی
 */
router.get("/featured", getFeaturedProducts);

/**
 * GET /api/products/:slug
 * دریافت محصول با slug
 */
router.get("/:slug", getProductBySlug);

/**
 * POST /api/products/:id/reviews
 * ثبت ریویو — نیاز به لاگین داره
 */
router.post("/:id/reviews", protect, createProductReview);

// ─── Admin Routes ─────────────────────────────────────────────────────────────

// /**
//  * GET /api/admin/products
//  * لیست همه محصولات با costPrice
//  */
// router.get("/admin/products", protect, isUserAdmin, adminGetProducts);

/**
 * POST /api/admin/products
 * ایجاد محصول جدید
 */
router.post("/", protect, isUserAdmin, upload.array("images", 10), createProduct);

/**
 * PUT /api/admin/products/:id
 * ویرایش محصول
 */
router.put("/:id", protect, isUserAdmin, updateProduct);

/**
 * DELETE /api/admin/products/:id
 * غیرفعال کردن محصول (soft delete)
 */
router.delete("/:id", protect, isUserAdmin, deleteProduct);

// /**
//  * PATCH /api/admin/products/:id/stock
//  * آپدیت موجودی انبار
//  */
// router.patch("/admin/products/:id/stock", protect, isUserAdmin, updateStock);

/**
 * DELETE /api/admin/products/:id/reviews/:reviewId
 * حذف نظر نامناسب
 */
router.delete(
    "/:id/reviews/:reviewId",
    protect,
    isUserAdmin,
    deleteReview
);

export default router;
