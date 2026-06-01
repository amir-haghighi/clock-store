"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CartItem } from "@/app/cart/page";

// ── Types ─────────────────────────────────────────────────────────────────────

type Step = "shipping" | "payment" | "review";

interface ShippingForm {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

interface PaymentForm {
    cardNumber: string;
    cardName: string;
    expiry: string;
    cvv: string;
}

// ── Mock cart (replace with your cart context) ────────────────────────────────

const MOCK_ITEMS: CartItem[] = [
    {
        id: "1",
        slug: "seiko-presage-cocktail-time",
        title: "Seiko Presage Cocktail Time",
        brand: "Seiko",
        image: "",
        price: 420,
        discountPrice: 349,
        color: { name: "Midnight Blue", hex: "#1e3a5f" },
        stock: 4,
        quantity: 1,
    },
    {
        id: "2",
        slug: "hamilton-khaki-field",
        title: "Hamilton Khaki Field Auto",
        brand: "Hamilton",
        image: "",
        price: 695,
        discountPrice: 0,
        color: { name: "Army Green", hex: "#4a5240" },
        stock: 10,
        quantity: 2,
    },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const STEPS: { key: Step; label: string; icon: typeof User }[] = [
    { key: "shipping", label: "Shipping", icon: MapPin },
    { key: "payment", label: "Payment", icon: CreditCard },
    { key: "review", label: "Review", icon: Check },
];

function formatCard(v: string) {
    return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(v: string) {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
    const items = MOCK_ITEMS;
    const API = process.env.NEXT_PUBLIC_API_URL ?? "";

    const [step, setStep] = useState<Step>("shipping");
    const [placing, setPlacing] = useState(false);
    const [placed, setPlaced] = useState(false);

    const [shipping, setShipping] = useState<ShippingForm>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: "United States",
    });

    const [payment, setPayment] = useState<PaymentForm>({
        cardNumber: "",
        cardName: "",
        expiry: "",
        cvv: "",
    });

    // totals
    const effectivePrice = (it: CartItem) =>
        it.discountPrice && it.discountPrice > 0 ? it.discountPrice : it.price;
    const subtotal = items.reduce((s, it) => s + effectivePrice(it) * it.quantity, 0);
    const shippingCost = subtotal >= 500 ? 0 : 15;
    const total = subtotal + shippingCost;

    const stepIndex = STEPS.findIndex((s) => s.key === step);

    const placeOrder = async () => {
        setPlacing(true);
        await new Promise((r) => setTimeout(r, 1800)); // simulate API
        setPlacing(false);
        setPlaced(true);
    };

    // ── Order Confirmed ──────────────────────────────────────────────────────
    if (placed) {
        return (
            <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col items-center justify-center gap-6 px-4 text-center">
                <div className="h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                    <Check className="h-9 w-9 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                        Order Placed!
                    </h2>
                    <p className="mt-2 text-zinc-400 text-sm max-w-xs mx-auto">
                        Thank you, {shipping.firstName}. Your order is confirmed and will be
                        shipped to {shipping.city}.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button asChild variant="outline" className="rounded-xl">
                        <Link href="/">Home</Link>
                    </Button>
                    <Button asChild className="rounded-xl">
                        <Link href="/products">Continue Shopping</Link>
                    </Button>
                </div>
            </div>
        );
    }

    // ── Main ─────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Header */}
            <div className="border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 sticky top-0 z-10">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-3">
                    <Link
                        href="/cart"
                        className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
                        Checkout
                    </h1>
                    <div className="ml-auto flex items-center gap-1 text-xs text-zinc-400">
                        <Lock className="h-3 w-3" />
                        Secure checkout
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

                {/* Step indicator */}
                <div className="flex items-center justify-center mb-10">
                    {STEPS.map((s, i) => {
                        const done = i < stepIndex;
                        const active = s.key === step;
                        return (
                            <div key={s.key} className="flex items-center">
                                <div className="flex flex-col items-center gap-1.5">
                                    <div
                                        className={cn(
                                            "h-9 w-9 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                            done
                                                ? "bg-zinc-900 border-zinc-900 dark:bg-zinc-100 dark:border-zinc-100"
                                                : active
                                                    ? "border-zinc-900 dark:border-zinc-100"
                                                    : "border-zinc-200 dark:border-zinc-700"
                                        )}
                                    >
                                        {done ? (
                                            <Check className={cn("h-4 w-4", "text-white dark:text-zinc-900")} />
                                        ) : (
                                            <s.icon
                                                className={cn(
                                                    "h-4 w-4",
                                                    active
                                                        ? "text-zinc-900 dark:text-zinc-100"
                                                        : "text-zinc-300 dark:text-zinc-600"
                                                )}
                                            />
                                        )}
                                    </div>
                                    <span
                                        className={cn(
                                            "text-xs font-medium",
                                            active
                                                ? "text-zinc-900 dark:text-zinc-100"
                                                : done
                                                    ? "text-zinc-500"
                                                    : "text-zinc-300 dark:text-zinc-600"
                                        )}
                                    >
                                        {s.label}
                                    </span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div
                                        className={cn(
                                            "h-px w-16 sm:w-24 mx-2 mb-5 transition-colors duration-300",
                                            i < stepIndex
                                                ? "bg-zinc-900 dark:bg-zinc-100"
                                                : "bg-zinc-200 dark:bg-zinc-800"
                                        )}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">

                    {/* ── Left: form area ── */}
                    <div>

                        {/* SHIPPING FORM */}
                        {step === "shipping" && (
                            <FormCard title="Shipping Address" icon={MapPin}>
                                <div className="grid grid-cols-2 gap-4">
                                    <Field
                                        label="First Name"
                                        value={shipping.firstName}
                                        onChange={(v) => setShipping({ ...shipping, firstName: v })}
                                        placeholder="John"
                                    />
                                    <Field
                                        label="Last Name"
                                        value={shipping.lastName}
                                        onChange={(v) => setShipping({ ...shipping, lastName: v })}
                                        placeholder="Doe"
                                    />
                                    <Field
                                        label="Email"
                                        type="email"
                                        value={shipping.email}
                                        onChange={(v) => setShipping({ ...shipping, email: v })}
                                        placeholder="john@example.com"
                                        className="col-span-2"
                                    />
                                    <Field
                                        label="Phone"
                                        type="tel"
                                        value={shipping.phone}
                                        onChange={(v) => setShipping({ ...shipping, phone: v })}
                                        placeholder="+1 (555) 000-0000"
                                        className="col-span-2"
                                    />
                                    <Field
                                        label="Address"
                                        value={shipping.address}
                                        onChange={(v) => setShipping({ ...shipping, address: v })}
                                        placeholder="123 Main St"
                                        className="col-span-2"
                                    />
                                    <Field
                                        label="City"
                                        value={shipping.city}
                                        onChange={(v) => setShipping({ ...shipping, city: v })}
                                        placeholder="New York"
                                    />
                                    <Field
                                        label="State"
                                        value={shipping.state}
                                        onChange={(v) => setShipping({ ...shipping, state: v })}
                                        placeholder="NY"
                                    />
                                    <Field
                                        label="ZIP Code"
                                        value={shipping.zip}
                                        onChange={(v) => setShipping({ ...shipping, zip: v })}
                                        placeholder="10001"
                                    />
                                    <Field
                                        label="Country"
                                        value={shipping.country}
                                        onChange={(v) => setShipping({ ...shipping, country: v })}
                                        placeholder="United States"
                                    />
                                </div>
                                <Button
                                    onClick={() => setStep("payment")}
                                    disabled={
                                        !shipping.firstName ||
                                        !shipping.email ||
                                        !shipping.address ||
                                        !shipping.city
                                    }
                                    className="mt-6 w-full rounded-xl gap-2 bg-zinc-900 hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 font-semibold h-11"
                                >
                                    Continue to Payment
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </FormCard>
                        )}

                        {/* PAYMENT FORM */}
                        {step === "payment" && (
                            <FormCard title="Payment Details" icon={CreditCard}>
                                {/* Card preview */}
                                <div className="h-36 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 p-5 flex flex-col justify-between text-white mb-6 shadow-xl relative overflow-hidden">
                                    <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/5" />
                                    <div className="absolute -right-2 top-8 h-20 w-20 rounded-full bg-white/5" />
                                    <div className="text-xs font-medium tracking-widest text-zinc-400">
                                        CREDIT CARD
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold tracking-widest font-mono">
                                            {payment.cardNumber || "•••• •••• •••• ••••"}
                                        </p>
                                        <div className="flex justify-between mt-1 text-xs text-zinc-400">
                                            <span>{payment.cardName || "CARD HOLDER"}</span>
                                            <span>{payment.expiry || "MM/YY"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Field
                                        label="Card Number"
                                        value={payment.cardNumber}
                                        onChange={(v) =>
                                            setPayment({ ...payment, cardNumber: formatCard(v) })
                                        }
                                        placeholder="1234 5678 9012 3456"
                                        className="col-span-2"
                                        maxLength={19}
                                    />
                                    <Field
                                        label="Cardholder Name"
                                        value={payment.cardName}
                                        onChange={(v) =>
                                            setPayment({ ...payment, cardName: v.toUpperCase() })
                                        }
                                        placeholder="JOHN DOE"
                                        className="col-span-2"
                                    />
                                    <Field
                                        label="Expiry Date"
                                        value={payment.expiry}
                                        onChange={(v) =>
                                            setPayment({ ...payment, expiry: formatExpiry(v) })
                                        }
                                        placeholder="MM/YY"
                                        maxLength={5}
                                    />
                                    <Field
                                        label="CVV"
                                        value={payment.cvv}
                                        onChange={(v) =>
                                            setPayment({
                                                ...payment,
                                                cvv: v.replace(/\D/g, "").slice(0, 4),
                                            })
                                        }
                                        placeholder="•••"
                                        maxLength={4}
                                        type="password"
                                    />
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <Button
                                        variant="outline"
                                        onClick={() => setStep("shipping")}
                                        className="rounded-xl h-11"
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                        Back
                                    </Button>
                                    <Button
                                        onClick={() => setStep("review")}
                                        disabled={
                                            !payment.cardNumber ||
                                            !payment.cardName ||
                                            !payment.expiry ||
                                            !payment.cvv
                                        }
                                        className="flex-1 rounded-xl gap-2 bg-zinc-900 hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 font-semibold h-11"
                                    >
                                        Review Order
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </FormCard>
                        )}

                        {/* REVIEW */}
                        {step === "review" && (
                            <FormCard title="Review Your Order" icon={Check}>
                                {/* Shipping summary */}
                                <SummaryBlock
                                    title="Shipping to"
                                    onEdit={() => setStep("shipping")}
                                >
                                    <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                                        {shipping.firstName} {shipping.lastName}
                                    </p>
                                    <p className="text-sm text-zinc-500">{shipping.email}</p>
                                    <p className="text-sm text-zinc-500">
                                        {shipping.address}, {shipping.city}, {shipping.state}{" "}
                                        {shipping.zip}
                                    </p>
                                </SummaryBlock>

                                <Separator className="my-4 dark:border-zinc-800" />

                                {/* Payment summary */}
                                <SummaryBlock title="Payment" onEdit={() => setStep("payment")}>
                                    <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium flex items-center gap-2">
                                        <CreditCard className="h-4 w-4 text-zinc-400" />
                                        •••• •••• •••• {payment.cardNumber.slice(-4) || "••••"}
                                    </p>
                                    <p className="text-sm text-zinc-500">{payment.cardName}</p>
                                </SummaryBlock>

                                <Separator className="my-4 dark:border-zinc-800" />

                                {/* Items */}
                                <div className="space-y-3">
                                    {items.map((it) => {
                                        const ep = effectivePrice(it);
                                        const imgSrc = it.image ? `${API}${it.image}` : null;
                                        return (
                                            <div key={it.id} className="flex items-center gap-3">
                                                <div className="h-12 w-12 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                                                    {imgSrc ? (
                                                        <img src={imgSrc} alt={it.title} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center">
                                                            <Package className="h-5 w-5 text-zinc-300 dark:text-zinc-600" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
                                                        {it.title}
                                                    </p>
                                                    <p className="text-xs text-zinc-400">
                                                        Qty: {it.quantity} · {it.color.name}
                                                    </p>
                                                </div>
                                                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 shrink-0">
                                                    ${(ep * it.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <Button
                                        variant="outline"
                                        onClick={() => setStep("payment")}
                                        className="rounded-xl h-11"
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                        Back
                                    </Button>
                                    <Button
                                        onClick={placeOrder}
                                        disabled={placing}
                                        className="flex-1 rounded-xl gap-2 bg-zinc-900 hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300 font-semibold h-11 shadow-md hover:shadow-lg"
                                    >
                                        {placing ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Placing Order…
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="h-4 w-4" />
                                                Place Order · ${total.toFixed(2)}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </FormCard>
                        )}
                    </div>

                    {/* ── Right: order summary ── */}
                    <div className="lg:sticky lg:top-20 h-fit">
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5 flex flex-col gap-4">
                            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                                Order Summary
                            </h2>

                            <div className="flex flex-col gap-3">
                                {items.map((it) => {
                                    const ep = effectivePrice(it);
                                    const imgSrc = it.image ? `${API}${it.image}` : null;
                                    return (
                                        <div key={it.id} className="flex items-center gap-3">
                                            <div className="relative h-11 w-11 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                                                {imgSrc ? (
                                                    <img src={imgSrc} alt={it.title} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <Package className="h-4 w-4 text-zinc-300 dark:text-zinc-600" />
                                                    </div>
                                                )}
                                                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center rounded-full bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 text-[10px] font-bold">
                                                    {it.quantity}
                                                </Badge>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">
                                                    {it.title}
                                                </p>
                                                <p className="text-xs text-zinc-400">{it.brand}</p>
                                            </div>
                                            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-50 shrink-0">
                                                ${(ep * it.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            <Separator className="dark:border-zinc-800" />

                            <div className="flex flex-col gap-2 text-sm">
                                <div className="flex justify-between text-zinc-500">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-zinc-500">
                                    <span>Shipping</span>
                                    <span className={shippingCost === 0 ? "text-emerald-600 dark:text-emerald-400" : ""}>
                                        {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
                                    </span>
                                </div>
                            </div>

                            <Separator className="dark:border-zinc-800" />

                            <div className="flex justify-between font-bold text-zinc-900 dark:text-zinc-50">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function FormCard({
    title,
    icon: Icon,
    children,
}: {
    title: string;
    icon: typeof User;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
            <div className="flex items-center gap-2 mb-6">
                <Icon className="h-4 w-4 text-zinc-400" />
                <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 tracking-tight">
                    {title}
                </h2>
            </div>
            {children}
        </div>
    );
}

function Field({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    className,
    maxLength,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    type?: string;
    className?: string;
    maxLength?: number;
}) {
    return (
        <div className={cn("flex flex-col gap-1.5", className)}>
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {label}
            </label>
            <input
                type={type}
                value={value}
                maxLength={maxLength}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="h-10 px-3 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-300 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-700 transition-shadow"
            />
        </div>
    );
}

function SummaryBlock({
    title,
    onEdit,
    children,
}: {
    title: string;
    onEdit: () => void;
    children: React.ReactNode;
}) {
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                    {title}
                </p>
                <button
                    onClick={onEdit}
                    className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors underline underline-offset-2"
                >
                    Edit
                </button>
            </div>
            <div className="space-y-0.5">{children}</div>
        </div>
    );
}
