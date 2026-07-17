
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
const API = process.env.NEXT_PUBLIC_API_URL ?? "";


const CheckoutForm = () => {
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
    const formatPrice = (n: number) =>
        new Intl.NumberFormat("fa-IR").format(n) + " " + t("toman");
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

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [discountApplied, setDiscountApplied] = useState(false);
    const [discountInput, setDiscountInput] = useState("");
    const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const discount = discountApplied ? Math.round(subtotal * 0.1) : 0;
    const deliveryValue = form.watch("delivery");
    const deliveryCost = DELIVERY_OPTIONS.find(d => d.id === deliveryValue)?.price ?? 0;
    const total = subtotal - discount + deliveryCost;
    async function onSubmit(values: CheckoutValues) {
        setIsSubmitting(true);
        await new Promise(r => setTimeout(r, 2000));
        // Redirect to Shaparak gateway (simulated)
        toast.success("در حال انتقال به درگاه شاپرک...");
        setIsSubmitting(false);
    }

    return (
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

                {/* ══ LEFT COL: Order Summary ═══════════════════════ */}
                <div className="lg:col-span-5 space-y-4">

                    {/* Cart items */}
                    <Card className="sticky top-6">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-gold" />
                                <h5>{t("orderSummary")}</h5>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">

                            {/* Items */}
                            <div className="space-y-3">
                                {cartItems.map(item => (
                                    <div key={item.slug} className="flex items-center justify-center  gap-3 ">
                                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-border ">
                                            <img
                                                src={!!item.image ? `${API}${item.image}` : undefined}
                                                alt={item.slug}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 text-center min-w-0 " >
                                            <p className="text-s-medium ">{item.title}</p>
                                            <div className="flex gap-4 text-center justify-center items-center ">
                                                <p className="text-muted-foreground">{item.brand}</p>
                                                <Badge variant="outline" className="mt-1">×{item.quantity}</Badge></div>
                                        </div>
                                        <p className="text-sm font-semibold text-gold shrink-0">
                                            {formatPrice(item.price)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <Separator />

                            {/* Discount Code */}
                            {/* <div>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                                            <Tag className="w-3 h-3" /> کد تخفیف
                                        </p>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="KRONO10"
                                                value={discountInput}
                                                onChange={e => setDiscountInput(e.target.value)}
                                                disabled={discountApplied}
                                                className="ltr text-left placeholder:text-right text-sm h-9"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={applyDiscount}
                                                disabled={discountApplied || !discountInput.trim()}
                                                className="shrink-0 h-9 text-xs"
                                            >
                                                {discountApplied ? "✓ اعمال شد" : "اعمال"}
                                            </Button>
                                        </div>
                                    </div>

                                    <Separator /> */}

                            {/* Price Breakdown */}
                            <div className="space-y-2.5 text-sm">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>{formatPrice(subtotal)}</span>
                                    <span>{t("productsTotal")}</span>
                                </div>
                                {/* {discountApplied && (
                                            <div className="flex justify-between text-emerald-500">
                                                <span>− {formatPrice(discount)}</span>
                                                <span>تخفیف (۱۰٪)</span>
                                            </div>
                                        )} */}
                                <div className="flex justify-between text-muted-foreground">
                                    <span>{deliveryCost === 0 ? t("free") : formatPrice(deliveryCost)}</span>
                                    <span>{t("deliveryCost")}</span>
                                </div>

                                <Separator />

                                <div className="flex justify-between font-bold text-base pt-1">
                                    <span className="text-gold">{formatPrice(total)}</span>
                                    <span>{t("total")}</span>
                                </div>
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-12 text-sm font-bold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12" />
                                        </svg>
                                        {t("loadingToPayment")}...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <Lock className="w-4 h-4" />
                                        {t("pay")}
                                    </span>
                                )}
                            </Button>

                            {/* Trust badges */}
                            <div className="flex items-center justify-center gap-4 pt-1">
                                {[
                                    { icon: Shield, label: t("secure") },
                                    { icon: Clock, label: t("support") },
                                ].map(({ icon: Icon, label }) => (
                                    <div key={label} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                        <Icon className="w-3 h-3 text-gold" />
                                        {label}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    )
}

export default CheckoutForm