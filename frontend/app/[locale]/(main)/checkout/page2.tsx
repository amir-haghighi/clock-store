"use client";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
    ChevronLeft,
    ChevronRight,
    Package,
    CreditCard,
    MapPin,
    User,
    Check,
    Lock,
    Loader2,
    ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CartItem } from "../cart/page";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useUser } from "@/hooks/useUser";
import Modal from "@/components/modal/modal";
import { useRouter } from '@/i18n/navigation';
import LoginSignup from "@/components/loginSignup/LoginSignup";

// ── Types ─────────────────────────────────────────────────────────────────────

type Step = "shipping" | "review";

// ── Zod schema — mirrors IShippingAddress (country commented out in model) ────

const shippingSchema = z.object({
    fullName: z
        .string()
        .min(3, "Full name must be at least 3 characters")
        .max(80, "Full name is too long"),
    city: z.string().min(2, "City is required").max(60),
    address: z.string().min(10, "Address must be at least 10 characters").max(200),
    postalCode: z
        .string()
        .regex(/^\d{10}$/, "Postal code must be exactly 10 digits")
        .optional()
        .or(z.literal("")),
});

type ShippingFormValues = z.infer<typeof shippingSchema>;


// ── Step config ───────────────────────────────────────────────────────────────

const STEPS: { key: Step; label: string; icon: typeof User }[] = [
    { key: "shipping", label: "Shipping", icon: MapPin },
    { key: "review", label: "Review & Pay", icon: CreditCard },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
    const router = useRouter()
    const { user } = useUser()
    if (!user) {

        return (
            <Modal open={!user} onOpenChange={(a) => router.push("/order")} >
                <LoginSignup >
                    <div className="mx-auto">

                        <p className="text-lg">for checking out you should first sing in </p>
                    </div>

                </LoginSignup>
            </Modal>
        )
    }

    const API = process.env.NEXT_PUBLIC_API_URL ?? "";

    const [step, setStep] = useState<Step>("shipping");
    const [redirecting, setRedirecting] = useState(false);
    // Saved shipping data to show on review step
    const [savedShipping, setSavedShipping] = useState<ShippingFormValues | null>(null);

    const form = useForm<ShippingFormValues>({
        resolver: zodResolver(shippingSchema),
        defaultValues: {
            city: "",
            address: "",
            postalCode: "",
        },
        mode: "onTouched",
    });

    // ── Totals ───────────────────────────────────────────────────────────────
    const effectivePrice = (it: CartItem) =>
        !!it.discountPrice && it.discountPrice > 0 ? it.discountPrice : it.price;
    const itemsPrice = items.reduce((s, it) => s + effectivePrice(it) * it.quantity, 0);
    const shippingPrice = itemsPrice >= 500 ? 0 : 15;
    const taxPrice = parseFloat((itemsPrice * 0.09).toFixed(2)); // 9% VAT
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    const stepIndex = STEPS.findIndex((s) => s.key === step);

    // ── Handlers ─────────────────────────────────────────────────────────────

    const onShippingSubmit = (values: ShippingFormValues) => {
        setSavedShipping(values);
        setStep("review");
    };

    const handlePayWithShaparak = async () => {
        if (!savedShipping) return;
        setRedirecting(true);

        // TODO: replace with your actual API call
        // POST /api/v1/orders  →  { authority, paymentUrl }
        // then: window.location.href = paymentUrl
        //
        // const res = await fetch(`${API}/api/v1/orders`, {
        //   method: "POST",
        //   credentials: "include",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({
        //     items: items.map(it => ({
        //       productId: it.id,
        //       title: it.title,
        //       image: it.image,
        //       price: effectivePrice(it),
        //       quantity: it.quantity,
        //       selectedColor: it.color.name,
        //     })),
        //     shippingAddress: savedShipping,
        //     paymentMethod: "shaparak",
        //     itemsPrice,
        //     shippingPrice,
        //     taxPrice,
        //     totalPrice,
        //   }),
        // });
        // const { paymentUrl } = await res.json();
        // window.location.href = paymentUrl;

        await new Promise((r) => setTimeout(r, 1500)); // simulate redirect delay
        setRedirecting(false);
        alert("Redirecting to Shaparak payment gateway...");
    };

    // ── Main render ───────────────────────────────────────────────────────────
    return (
        <div>hi</div>
        // <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">

        //     {/* ── Sticky header ── */}
        //     <div className="border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 sticky top-0 z-10">
        //         <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-3">
        //             <Link
        //                 href="/cart"
        //                 className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
        //             >
        //                 <ChevronLeft className="h-5 w-5" />
        //             </Link>
        //             <h1 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
        //                 Checkout
        //             </h1>
        //             <div className="ml-auto flex items-center gap-1.5 text-xs text-zinc-400">
        //                 <Lock className="h-3 w-3" />
        //                 Secure checkout
        //             </div>
        //         </div>
        //     </div>

        //     <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        //         {/* ── Step indicator ── */}
        //         <div className="flex items-center justify-center mb-10">
        //             {STEPS.map((s, i) => {
        //                 const done = i < stepIndex;
        //                 const active = s.key === step;
        //                 return (
        //                     <div key={s.key} className="flex items-center">
        //                         <div className="flex flex-col items-center gap-1.5">
        //                             <div
        //                                 className={cn(
        //                                     "h-9 w-9 rounded-full flex items-center justify-center border-2 transition-all duration-300",
        //                                     done
        //                                         ? "bg-zinc-900 border-zinc-900 dark:bg-zinc-100 dark:border-zinc-100"
        //                                         : active
        //                                             ? "border-zinc-900 dark:border-zinc-100"
        //                                             : "border-zinc-200 dark:border-zinc-700"
        //                                 )}
        //                             >
        //                                 {done ? (
        //                                     <Check className="h-4 w-4 text-white dark:text-zinc-900" />
        //                                 ) : (
        //                                     <s.icon
        //                                         className={cn(
        //                                             "h-4 w-4",
        //                                             active
        //                                                 ? "text-zinc-900 dark:text-zinc-100"
        //                                                 : "text-zinc-300 dark:text-zinc-600"
        //                                         )}
        //                                     />
        //                                 )}
        //                             </div>
        //                             <span
        //                                 className={cn(
        //                                     "text-xs font-medium whitespace-nowrap",
        //                                     active
        //                                         ? "text-zinc-900 dark:text-zinc-100"
        //                                         : done
        //                                             ? "text-zinc-500"
        //                                             : "text-zinc-300 dark:text-zinc-600"
        //                                 )}
        //                             >
        //                                 {s.label}
        //                             </span>
        //                         </div>
        //                         {i < STEPS.length - 1 && (
        //                             <div
        //                                 className={cn(
        //                                     "h-px w-20 sm:w-32 mx-3 mb-5 transition-colors duration-300",
        //                                     i < stepIndex
        //                                         ? "bg-zinc-900 dark:bg-zinc-100"
        //                                         : "bg-zinc-200 dark:bg-zinc-800"
        //                                 )}
        //                             />
        //                         )}
        //                     </div>
        //                 );
        //             })}
        //         </div>

        //         <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">

        //             {/* ── Left panel ── */}
        //             <div>

        //                 {/* STEP 1 — SHIPPING */}
        //                 {step === "shipping" && (
        //                     <FormCard title="Shipping Address" icon={MapPin}>

        //                         <form
        //                             onSubmit={form.handleSubmit(onShippingSubmit)}
        //                             className="space-y-4"
        //                         >
        //                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        //                                 {/* City */}
        //                                 <Controller
        //                                     control={form.control}
        //                                     name="city"
        //                                     render={({ field, fieldState }) => (
        //                                         <Field>
        //                                             <FieldLabel className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
        //                                                 City
        //                                             </FieldLabel>

        //                                             <Input
        //                                                 placeholder="Tehran"
        //                                                 {...field}
        //                                                 className="h-10 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus-visible:ring-zinc-300 dark:focus-visible:ring-zinc-700"
        //                                             />

        //                                             {fieldState.invalid && (
        //                                                 <FieldError errors={[fieldState.error]} />
        //                                             )}
        //                                         </Field>
        //                                     )}
        //                                 />

        //                                 {/* Postal code */}
        //                                 <Controller
        //                                     control={form.control}
        //                                     name="postalCode"
        //                                     render={({ field, fieldState }) => (
        //                                         <Field>
        //                                             <FieldLabel className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
        //                                                 Postal Code
        //                                                 <span className="ml-1 text-zinc-300 dark:text-zinc-600 font-normal">
        //                                                     (optional)
        //                                                 </span>
        //                                             </FieldLabel>

        //                                             <Input
        //                                                 placeholder="1234567890"
        //                                                 maxLength={10}
        //                                                 {...field}
        //                                                 className="h-10 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus-visible:ring-zinc-300 dark:focus-visible:ring-zinc-700"
        //                                             />

        //                                             {fieldState.invalid && (
        //                                                 <FieldError errors={[fieldState.error]} />
        //                                             )}
        //                                         </Field>
        //                                     )}
        //                                 />

        //                                 {/* Address */}
        //                                 <Controller
        //                                     control={form.control}
        //                                     name="address"
        //                                     render={({ field, fieldState }) => (
        //                                         <Field className="sm:col-span-2">
        //                                             <FieldLabel className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
        //                                                 Street Address
        //                                             </FieldLabel>

        //                                             <Input
        //                                                 placeholder="Valiasr St, Alley 5, No. 12"
        //                                                 {...field}
        //                                                 className="h-10 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm focus-visible:ring-zinc-300 dark:focus-visible:ring-zinc-700"
        //                                             />

        //                                             {fieldState.invalid && (
        //                                                 <FieldError errors={[fieldState.error]} />
        //                                             )}
        //                                         </Field>
        //                                     )}
        //                                 />
        //                             </div>

        //                             <Button
        //                                 type="submit"
        //                                 className="mt-2 w-full rounded-xl gap-2  transition-all duration-200 shadow-sm hover:shadow-xl"
        //                             >
        //                                 pay
        //                                 <ChevronRight className="h-4 w-4" />
        //                             </Button>
        //                         </form>
        //                     </FormCard>
        //                 )}

        //                 {/* STEP 2 — REVIEW & PAY */}
        //                 {step === "review" && savedShipping && (
        //                     <FormCard title="Review & Pay" icon={CreditCard}>

        //                         {/* Shipping summary */}
        //                         <SummaryBlock
        //                             title="Shipping to"
        //                             onEdit={() => setStep("shipping")}
        //                         >
        //                             <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
        //                                 {savedShipping.fullName}
        //                             </p>
        //                             <p className="text-sm text-zinc-500">
        //                                 {savedShipping.address}
        //                                 {savedShipping.city && `, ${savedShipping.city}`}
        //                                 {savedShipping.postalCode && ` — ${savedShipping.postalCode}`}
        //                             </p>
        //                         </SummaryBlock>

        //                         <Separator className="my-5 dark:border-zinc-800" />

        //                         {/* Items */}
        //                         <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
        //                             Items ({items.length})
        //                         </p>
        //                         <div className="space-y-3 mb-5">
        //                             {items.map((it) => {
        //                                 const ep = effectivePrice(it);
        //                                 const imgSrc = it.image ? `${API}${it.image}` : null;
        //                                 return (
        //                                     <div key={it.id} className="flex items-center gap-3">
        //                                         <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
        //                                             {imgSrc ? (
        //                                                 <img
        //                                                     src={imgSrc}
        //                                                     alt={it.title}
        //                                                     className="h-full w-full object-cover"
        //                                                 />
        //                                             ) : (
        //                                                 <div className="flex h-full w-full items-center justify-center">
        //                                                     <Package className="h-5 w-5 text-zinc-300 dark:text-zinc-600" />
        //                                                 </div>
        //                                             )}
        //                                             <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center rounded-full bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 text-[10px] font-bold leading-none">
        //                                                 {it.quantity}
        //                                             </Badge>
        //                                         </div>
        //                                         <div className="flex-1 min-w-0">
        //                                             <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
        //                                                 {it.title}
        //                                             </p>
        //                                             <div className="flex items-center gap-1.5 mt-0.5">
        //                                                 <span
        //                                                     className="h-2.5 w-2.5 rounded-full border border-zinc-200 dark:border-zinc-700"
        //                                                     style={{ backgroundColor: it.color.hex }}
        //                                                 />
        //                                                 <p className="text-xs text-zinc-400">{it.color.name}</p>
        //                                             </div>
        //                                         </div>
        //                                         <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 shrink-0">
        //                                             ${(ep * it.quantity).toFixed(2)}
        //                                         </span>
        //                                     </div>
        //                                 );
        //                             })}
        //                         </div>

        //                         <Separator className="mb-5 dark:border-zinc-800" />

        //                         {/* Price breakdown */}
        //                         <div className="space-y-2 text-sm mb-6">
        //                             <div className="flex justify-between text-zinc-500">
        //                                 <span>Items</span>
        //                                 <span>${itemsPrice.toFixed(2)}</span>
        //                             </div>
        //                             <div className="flex justify-between text-zinc-500">
        //                                 <span>Shipping</span>
        //                                 <span
        //                                     className={
        //                                         shippingPrice === 0
        //                                             ? "text-emerald-600 dark:text-emerald-400 font-medium"
        //                                             : ""
        //                                     }
        //                                 >
        //                                     {shippingPrice === 0 ? "Free" : `$${shippingPrice.toFixed(2)}`}
        //                                 </span>
        //                             </div>
        //                             <div className="flex justify-between text-zinc-500">
        //                                 <span>Tax (9%)</span>
        //                                 <span>${taxPrice.toFixed(2)}</span>
        //                             </div>
        //                             <Separator className="!my-3 dark:border-zinc-800" />
        //                             <div className="flex justify-between font-bold text-zinc-900 dark:text-zinc-50 text-base">
        //                                 <span>Total</span>
        //                                 <span>${totalPrice.toFixed(2)}</span>
        //                             </div>
        //                         </div>

        //                         {/* Shaparak payment box */}
        //                         <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-4 mb-5 flex items-center gap-3">
        //                             <div className="h-10 w-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center shrink-0 shadow-sm">
        //                                 <CreditCard className="h-5 w-5 text-zinc-500" />
        //                             </div>
        //                             <div className="min-w-0">
        //                                 <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
        //                                     Pay with Shaparak
        //                                 </p>
        //                                 <p className="text-xs text-zinc-400 mt-0.5">
        //                                     You'll be securely redirected to the payment gateway
        //                                 </p>
        //                             </div>
        //                             <Check className="h-4 w-4 text-emerald-500 shrink-0 ml-auto" />
        //                         </div>

        //                         <div className="flex gap-3">
        //                             <Button
        //                                 variant="outline"
        //                                 onClick={() => setStep("shipping")}
        //                                 className="rounded-xl h-11 px-4"
        //                             >
        //                                 <ChevronLeft className="h-4 w-4 mr-1" />
        //                                 Back
        //                             </Button>
        //                             <Button
        //                                 onClick={handlePayWithShaparak}
        //                                 disabled={redirecting}
        //                                 className="flex-1 rounded-xl gap-2 bg-zinc-900 hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 font-semibold h-11 shadow-md hover:shadow-lg transition-all duration-200"
        //                             >
        //                                 {redirecting ? (
        //                                     <>
        //                                         <Loader2 className="h-4 w-4 animate-spin" />
        //                                         Redirecting…
        //                                     </>
        //                                 ) : (
        //                                     <>
        //                                         <Lock className="h-4 w-4" />
        //                                         Pay ${totalPrice.toFixed(2)}
        //                                         <ExternalLink className="h-3.5 w-3.5 opacity-60" />
        //                                     </>
        //                                 )}
        //                             </Button>
        //                         </div>
        //                     </FormCard>
        //                 )}
        //             </div>

        //             {/* ── Right: sticky order summary ── */}
        //             <div className="lg:sticky lg:top-20 h-fit">
        //                 <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5 flex flex-col gap-4">
        //                     <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
        //                         Order Summary
        //                     </h2>

        //                     <div className="flex flex-col gap-3">
        //                         {items.map((it) => {
        //                             const ep = effectivePrice(it);
        //                             const imgSrc = it.image ? `${API}${it.image}` : null;
        //                             return (
        //                                 <div key={it.id} className="flex items-center gap-3">
        //                                     <div className="relative h-11 w-11 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
        //                                         {imgSrc ? (
        //                                             <img
        //                                                 src={imgSrc}
        //                                                 alt={it.title}
        //                                                 className="h-full w-full object-cover"
        //                                             />
        //                                         ) : (
        //                                             <div className="flex h-full w-full items-center justify-center">
        //                                                 <Package className="h-4 w-4 text-zinc-300 dark:text-zinc-600" />
        //                                             </div>
        //                                         )}
        //                                         <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center rounded-full bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 text-[10px] font-bold leading-none">
        //                                             {it.quantity}
        //                                         </Badge>
        //                                     </div>
        //                                     <div className="flex-1 min-w-0">
        //                                         <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">
        //                                             {it.title}
        //                                         </p>
        //                                         <p className="text-xs text-zinc-400">{it.brand}</p>
        //                                     </div>
        //                                     <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-50 shrink-0">
        //                                         ${(ep * it.quantity).toFixed(2)}
        //                                     </span>
        //                                 </div>
        //                             );
        //                         })}
        //                     </div>

        //                     <Separator className="dark:border-zinc-800" />

        //                     <div className="flex flex-col gap-2 text-sm">
        //                         <div className="flex justify-between text-zinc-500">
        //                             <span>Items</span>
        //                             <span>${itemsPrice.toFixed(2)}</span>
        //                         </div>
        //                         <div className="flex justify-between text-zinc-500">
        //                             <span>Shipping</span>
        //                             <span
        //                                 className={
        //                                     shippingPrice === 0
        //                                         ? "text-emerald-600 dark:text-emerald-400"
        //                                         : ""
        //                                 }
        //                             >
        //                                 {shippingPrice === 0 ? "Free" : `$${shippingPrice.toFixed(2)}`}
        //                             </span>
        //                         </div>
        //                         <div className="flex justify-between text-zinc-500">
        //                             <span>Tax</span>
        //                             <span>${taxPrice.toFixed(2)}</span>
        //                         </div>
        //                     </div>

        //                     <Separator className="dark:border-zinc-800" />

        //                     <div className="flex justify-between font-bold text-zinc-900 dark:text-zinc-50">
        //                         <span>Total</span>
        //                         <span>${totalPrice.toFixed(2)}</span>
        //                     </div>
        //                 </div>
        //             </div>

        //         </div>
        //     </div>
        // </div >
    );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

// function FormCard({
//     title,
//     icon: Icon,
//     children,
// }: {
//     title: string;
//     icon: typeof User;
//     children: React.ReactNode;
// }) {
//     return (
//         <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
//             <div className="flex items-center gap-2 mb-6">
//                 <Icon className="h-4 w-4 text-zinc-400" />
//                 <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 tracking-tight">
//                     {title}
//                 </h2>
//             </div>
//             {children}
//         </div>
//     );
// }

// function SummaryBlock({
//     title,
//     onEdit,
//     children,
// }: {
//     title: string;
//     onEdit: () => void;
//     children: React.ReactNode;
// }) {
//     return (
//         <div>
//             <div className="flex items-center justify-between mb-2">
//                 <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
//                     {title}
//                 </p>
//                 <button
//                     onClick={onEdit}
//                     className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors underline underline-offset-2"
//                 >
//                     Edit
//                 </button>
//             </div>
//             <div className="space-y-0.5">{children}</div>
//         </div>
//     );
// }