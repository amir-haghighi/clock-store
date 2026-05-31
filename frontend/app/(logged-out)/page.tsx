"use client";


import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFeaturedProducts } from "@/hooks/useProducts";
import { PackageOpen, RefreshCw, AlertCircle } from "lucide-react";

/* ---------- Loading skeleton ---------- */
function ProductSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <Skeleton className="h-52 w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="mt-4 h-9 w-full rounded-xl" />
      </div>
    </div>
  );
}

/* ---------- Products Page ---------- */
export default function ProductsPage() {
  const { products, error, isEmpty, loading, isFetching, refetch } =
    useFeaturedProducts();
  console.log(error)
  return (
    <main className="min-h-screen">
      <div className="mx-auto w-screen px-4 py-12 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="mb-10 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              All Products
            </h1>
            {!loading && !error && (
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {products.length} item{products.length !== 1 ? "s" : ""} available
              </p>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            disabled={loading}
            className="shrink-0 gap-2 rounded-xl"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            refetch
          </Button>
        </div>

        {/* Error state */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-red-200 bg-red-50 py-16 text-center dark:border-red-900 dark:bg-red-950/30">
            <AlertCircle className="h-10 w-10 text-red-400" />
            <div>
              <p className="font-semibold text-red-700 dark:text-red-400">
                Failed to load products
              </p>
              <p className="mt-1 text-sm text-red-500 dark:text-red-500">
                {typeof error === "string" ? error : "Something went wrong. Please try again."}
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={refetch}
              className="rounded-xl gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        )}

        {/* Loading skeleton grid */}
        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && isEmpty && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-zinc-200 bg-white py-24 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <PackageOpen className="h-12 w-12 text-zinc-300 dark:text-zinc-600" />
            <div>
              <p className="font-semibold text-zinc-700 dark:text-zinc-300">
                No products found
              </p>
              <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
                Check back later or try refreshing.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              className="rounded-xl gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        )}

        {/* Products grid */}
        {!loading && !error && !isEmpty && (
          <div className="grid gap-4  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  xl:grid-cols-6 2xl:grid-cols-7">
            {isEmpty ? <p>no products found!</p>
              : products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            }
          </div>
        )}
      </div>
    </main>
  );
}
