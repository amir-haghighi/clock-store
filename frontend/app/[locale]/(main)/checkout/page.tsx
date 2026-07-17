"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    ShoppingBag, Truck, Tag, CreditCard, ChevronLeft,
    Clock, Shield, Lock, CheckCircle2, Package
} from "lucide-react";
import { useState, useTransition } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { toast } from "react-hot-toast";
import { useTranslations } from "next-intl";
import { useCart } from "@/hooks/useCart";
import OrderSummary from "@/components/checkout/OrderSummary";
const API = process.env.NEXT_PUBLIC_API_URL ?? "";


const IRANIAN_PROVINCES = [
    "تهران", "اصفهان", "فارس", "خراسان رضوی", "آذربایجان شرقی",
    "مازندران", "گیلان", "البرز", "کرمان", "سیستان و بلوچستان",
];








// ─── Page ────────────────────────────────────────────────────
export default function CheckoutPage() {
    // ─── using cart data ─────────────────────────────────────────────────
    const { items: cartItems } = useCart()

    // ─── translations ─────────────────────────────────────────────────
    const t = useTranslations("checkout");
    const v = useTranslations("validation");
    // ─── consts  ────────────────────────
    const DELIVERY_OPTIONS = [
        { id: "express", label: t("express"), price: 250_000 },
        { id: "normal", label: t("normal"), price: 0 },
    ];
    const formatPrice = (n: number) => {
        return new Intl.NumberFormat("fa-IR").format(n) + " " + t("toman");
    }
    // ─── Zod Schema ──────────────────────────────────────────────
    const checkoutSchema = z.object({
        fullName: z.string().min(2, v("fullNameMin")),
        phone: z.string().regex(/^(\+98|0)?9\d{9}$/, v("invalidPhone")),
        email: z.email(v("invalidEmail")),
        province: z.string().min(1, v("required")),
        city: z.string().min(2, v("required")),
        address: z.string().min(10, v("addressMin")),
        postalCode: z.string().regex(/^\d{10}$/, v("postalCodeMin")),
        delivery: z.enum(["express", "normal"]),
        discountCode: z.string().optional(),
    });

    type CheckoutValues = z.infer<typeof checkoutSchema>;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [discountApplied, setDiscountApplied] = useState(false);
    const [discountInput, setDiscountInput] = useState("");

    const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const discount = discountApplied ? Math.round(subtotal * 0.1) : 0;

    const form = useForm<CheckoutValues>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            fullName: "",
            phone: "",
            email: "",
            province: "",
            city: "",
            address: "",
            postalCode: "",
            delivery: "normal",
            discountCode: "",
        },
    });

    const deliveryValue = form.watch("delivery");
    const deliveryCost = DELIVERY_OPTIONS.find(d => d.id === deliveryValue)?.price ?? 0;
    const total = subtotal - discount + deliveryCost;
    function applyDiscount() {

        if (discountInput.trim().toUpperCase() === "KRONO10") {
            setDiscountApplied(true);
            toast.success("کد تخفیف اعمال شد! ۱۰٪ تخفیف");
        } else {
            toast.error("کد تخفیف معتبر نیست");
        }
    }

    async function onSubmit(values: CheckoutValues) {
        setIsSubmitting(true);
        await new Promise(r => setTimeout(r, 2000));
        // Redirect to Shaparak gateway (simulated)
        toast.success("در حال انتقال به درگاه شاپرک...");
        setIsSubmitting(false);
    }

    return (
        <div className=" text-right min-h-screen bg-background">

            {/* ── Top Bar ── */}
            <div className="border-b border-border px-6 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Lock className="w-3.5 h-3.5 text-gold" />
                        <span>{t("securePayment")}</span>
                    </div>
                    <a href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                        {t("backToStore")}
                    </a>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 py-10">

                {/* ── Page Title ── */}
                <div className="mb-10">
                    <p className="label-luxury mb-2">{t("finalPayment")}</p>
                    <h1 className="text-3xl font-bold">{t("completeOrder")}</h1>
                    <div className="divider-gold w-24 mt-3" />
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* ══ RIGHT COL: Form ══════════════════════════════ */}
                        <div className="lg:col-span-7 space-y-6">

                            {/* ── Shipping Info ── */}
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2">
                                        <Truck className="w-5 h-5 text-gold" />
                                        <h5>{t("shippingInfo")}</h5>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">

                                    {/* Name and contact row */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Controller
                                            control={form.control}
                                            name="fullName"
                                            render={({ field, fieldState }) => (
                                                <Field>
                                                    <FieldLabel>{t("name")}*</FieldLabel>
                                                    <Input placeholder="" {...field} />
                                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                </Field>
                                            )}
                                        />

                                        <Controller
                                            control={form.control}
                                            name="phone"
                                            render={({ field, fieldState }) => (
                                                <Field>
                                                    <FieldLabel>{t("phone")}*</FieldLabel>
                                                    <Input placeholder="09123456789" type="tel" {...field} />
                                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                </Field>
                                            )}
                                        />
                                    </div>


                                    {/* Province / City */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Controller
                                            control={form.control}
                                            name="city"

                                            render={({ field, fieldState }) => (
                                                <Field>
                                                    <FieldLabel>{t("city")}*</FieldLabel>
                                                    <Input  {...field} />
                                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                </Field>
                                            )}
                                        />
                                        <Controller
                                            control={form.control}
                                            name="province"
                                            render={({ field, fieldState }) => (
                                                <Field>
                                                    <FieldLabel>{t("province")}*</FieldLabel>
                                                    <Input  {...field} />
                                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                </Field>
                                            )}
                                        />
                                    </div>

                                    {/* Address */}
                                    <Controller
                                        control={form.control}
                                        name="address"
                                        render={({ field, fieldState }) => (
                                            <Field>
                                                <FieldLabel>{t("address")}</FieldLabel>
                                                <Input  {...field} />
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                            </Field>
                                        )}
                                    />

                                    {/* Postal Code */}
                                    <Controller
                                        control={form.control}
                                        name="postalCode"
                                        render={({ field, fieldState }) => (
                                            <Field className="max-w-xs">
                                                <FieldLabel>{t("postalCode")}</FieldLabel>
                                                <Input placeholder="1234567890" maxLength={10} {...field} className="ltr text-left placeholder:text-right" />
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                            </Field>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            {/* ── Delivery Method ── */}
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="w-5 h-5 text-gold" />
                                        <h5>{t("paymentMethod")}</h5>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Controller
                                        control={form.control}
                                        name="delivery"
                                        render={({ field }) => (
                                            <RadioGroup
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                className="space-y-3"
                                            >
                                                {DELIVERY_OPTIONS.map(opt => (
                                                    <label
                                                        key={opt.id}
                                                        htmlFor={`delivery-${opt.id}`}
                                                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 ${field.value === opt.id
                                                            ? "border-gold bg-gold-subtle"
                                                            : "border-border hover:border-gold/40"
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <RadioGroupItem value={opt.id} id={`delivery-${opt.id}`} />
                                                            <span className="text-sm font-medium">{opt.label}</span>
                                                        </div>
                                                        <span className={`text-sm font-semibold ${opt.price === 0 ? "text-emerald-500" : "text-foreground"}`}>
                                                            {opt.price === 0 ? t("free") : formatPrice(opt.price)}
                                                        </span>
                                                    </label>
                                                ))}
                                            </RadioGroup>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            {/* ── Payment Gateway ── */}

                        </div>

                        <OrderSummary cartItems={cartItems} deliveryCost={deliveryCost} formatPrice={formatPrice} isSubmitting={isSubmitting} total={total} subTotal={subtotal} />


                    </div>
                </form>
            </main>
        </div >
    );
}