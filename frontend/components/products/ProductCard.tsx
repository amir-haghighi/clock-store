"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, Package } from "lucide-react";

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountPrice: number;
  images: string[];
  brand: string;
  category: string;
  stock: number;
  rating: number;
  numReviews: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = !!product?.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;
  const src = `${process.env.NEXT_PUBLIC_API_URL}${product.images[0]}`;

  return (
    <Card className="group mx-auto flex flex-col justify-center overflow-hidden rounded-2xl border w-52 h-100  gap-0 border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 dark:border-zinc-800 dark:bg-zinc-900 pt-0">
      {/* Image / Placeholder */}
      <div className="relative h-100  w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {product.images.length > 0 ? (
          <img
            src={src}
            alt={product.title}
            height={100}
            className="h-full  w-full object-covers transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="h-16 w-16 text-zinc-300 dark:text-zinc-600" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1">
          {hasDiscount && (
            <Badge className="bg-rose-500 text-white hover:bg-rose-600 text-xs font-semibold">
              -{discountPercent}%
            </Badge>
          )}
          {!product.isActive && (
            <Badge variant="secondary" className="text-xs">
              Unavailable
            </Badge>
          )}
        </div>

        {/* Stock warning */}
        {product.stock <= 3 && product.stock > 0 && (
          <div className="absolute bottom-2 right-2">
            <Badge
              variant="outline"
              className="border-amber-400 bg-amber-50 text-amber-700 text-xs dark:bg-amber-950 dark:text-amber-300"
            >
              Only {product.stock} left
            </Badge>
          </div>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
            <span className="rounded-full bg-white/90 px-4 py-1 text-sm font-semibold text-zinc-800 dark:bg-zinc-900/90 dark:text-white">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Header */}
      <CardHeader className="pb-1 pt-4">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-1 text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {product.title}
          </CardTitle>
          <Badge
            variant="secondary"
            className="shrink-0 capitalize text-xs font-medium"
          >
            {product.category}
          </Badge>
        </div>

        {/* Rating */}
        <div className="flex items-center  gap-1.5 pt-0.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${i < Math.round(product.rating)
                  ? "fill-amber-400 text-amber-400"
                  : "fill-zinc-200 text-zinc-200 dark:fill-zinc-700 dark:text-zinc-700"
                  }`}
              />
            ))}
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            ({product.numReviews} reviews)
          </span>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="flex-1 pb-3">

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            ${product.discountPrice}
          </span>
          {hasDiscount && (
            <span className="text-sm text-zinc-400 line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
          Brand: <span className="font-medium capitalize">{product.brand}</span>
        </p>
      </CardContent>

      {/* Footer */}
      <CardFooter className="pt-0 pb-4">
        <Button
          className="w-full gap-2 rounded-xl font-semibold transition-all duration-200"
          disabled={product.stock === 0 || !product.isActive}
        >
          <ShoppingCart className="h-4 w-4" />
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
