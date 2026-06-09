"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    ShoppingBag, Truck, Tag, CreditCard, ChevronLeft,
    Clock, Shield, Lock, CheckCircle2, Package
} from "lucide-react";
import { useState } from "react";

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

// ─── Mock cart items ──────────────────────────────────────────
const cartItems = [
    {
        id: "1",
        name: "Rolex Submariner",
        brand: "Rolex",
        price: 85_000_000,
        qty: 1,
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=120&q=80",
    },
    {
        id: "2",
        name: "Omega Seamaster",
        brand: "Omega",
        price: 42_000_000,
        qty: 1,
        image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=120&q=80",
    },
];

const DELIVERY_OPTIONS = [
    { id: "express", label: "ارسال اکسپرس (۱–۲ روز کاری)", price: 250_000 },
    { id: "normal", label: "ارسال عادی (۳–۵ روز کاری)", price: 0 },
];

const IRANIAN_PROVINCES = [
    "تهران", "اصفهان", "فارس", "خراسان رضوی", "آذربایجان شرقی",
    "مازندران", "گیلان", "البرز", "کرمان", "سیستان و بلوچستان",
];

// ─── Zod Schema ──────────────────────────────────────────────
const checkoutSchema = z.object({
    firstName: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد"),
    lastName: z.string().min(2, "نام خانوادگی باید حداقل ۲ کاراکتر باشد"),
    phone: z.string().regex(/^(\+98|0)?9\d{9}$/, "شماره موبایل معتبر وارد کنید"),
    email: z.string().email("ایمیل معتبر وارد کنید"),
    province: z.string().min(1, "استان را انتخاب کنید"),
    city: z.string().min(2, "شهر را وارد کنید"),
    address: z.string().min(10, "آدرس باید حداقل ۱۰ کاراکتر باشد"),
    postalCode: z.string().regex(/^\d{10}$/, "کد پستی باید ۱۰ رقم باشد"),
    delivery: z.enum(["express", "normal"]),
    discountCode: z.string().optional(),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

// ─── Helpers ─────────────────────────────────────────────────
const formatPrice = (n: number) =>
    new Intl.NumberFormat("fa-IR").format(n) + " تومان";

// ─── Page ────────────────────────────────────────────────────
export default function CheckoutPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [discountApplied, setDiscountApplied] = useState(false);
    const [discountInput, setDiscountInput] = useState("");

    const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
    const discount = discountApplied ? Math.round(subtotal * 0.1) : 0;

    const form = useForm<CheckoutValues>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
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
        <div className="rtl text-right min-h-screen bg-background">

            {/* ── Top Bar ── */}
            <div className="border-b border-border px-6 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Lock className="w-3.5 h-3.5 text-gold" />
                        <span>پرداخت امن با رمزنگاری SSL</span>
                    </div>
                    <a href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                        بازگشت به فروشگاه
                    </a>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 py-10">

                {/* ── Page Title ── */}
                <div className="mb-10">
                    <p className="label-luxury mb-2">پرداخت نهایی</p>
                    <h1 className="text-3xl font-bold">تکمیل سفارش</h1>
                    <div className="divider-gold w-24 mt-3" />
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* ══ RIGHT COL: Form ══════════════════════════════ */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* ── Shipping Info ── */}
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2">
                                        <Truck className="w-5 h-5 text-gold" />
                                        <h5>اطلاعات ارسال</h5>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">

                                    {/* Name row */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Controller
                                            control={form.control}
                                            name="firstName"
                                            render={({ field, fieldState }) => (
                                                <Field>
                                                    <FieldLabel>نام *</FieldLabel>
                                                    <Input placeholder="" {...field} />
                                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                </Field>
                                            )}
                                        />
                                        <Controller
                                            control={form.control}
                                            name="lastName"
                                            render={({ field, fieldState }) => (
                                                <Field>
                                                    <FieldLabel>نام خانوادگی *</FieldLabel>
                                                    <Input placeholder="" {...field} />
                                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                </Field>
                                            )}
                                        />
                                    </div>

                                    {/* Contact row */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Controller
                                            control={form.control}
                                            name="phone"
                                            render={({ field, fieldState }) => (
                                                <Field>
                                                    <FieldLabel>شماره موبایل *</FieldLabel>
                                                    <Input placeholder="09123456789" type="tel" {...field} className="ltr text-left placeholder:text-right" />
                                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                </Field>
                                            )}
                                        />



                                        {/* Province / City */}

                                        <Controller
                                            control={form.control}
                                            name="city"
                                            render={({ field, fieldState }) => (
                                                <Field>
                                                    <FieldLabel>شهر *</FieldLabel>
                                                    <Input placeholder="تهران" {...field} />
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
                                                <FieldLabel>آدرس کامل *</FieldLabel>
                                                <Input placeholder="خیابان، کوچه، پلاک، واحد" {...field} />
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
                                                <FieldLabel>کد پستی *</FieldLabel>
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
                                        <h5>روش ارسال</h5>
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
                                                            {opt.price === 0 ? "رایگان" : formatPrice(opt.price)}
                                                        </span>
                                                    </label>
                                                ))}
                                            </RadioGroup>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            {/* ── Payment Gateway ── */}
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="w-5 h-5 text-gold" />
                                        <h5>روش پرداخت</h5>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {/* Single Shaparak option */}
                                    <div className="flex items-center justify-between p-4 rounded-xl border border-gold bg-gold-subtle">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center shrink-0">
                                                {/* Shaparak logo placeholder */}
                                                <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none">
                                                    <rect width="40" height="40" rx="8" fill="#1a5276" />
                                                    <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="#f0b429" fontSize="11" fontWeight="bold" fontFamily="sans-serif">شاپرک</text>
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">درگاه پرداخت شاپرک</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">بانک ملت · پرداخت آنلاین امن</p>
                                            </div>
                                        </div>
                                        <CheckCircle2 className="w-5 h-5 text-gold shrink-0" />
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-3">
                                        {["visa-like", "mastercard-like", "sheba"].map((_, i) => (
                                            <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Shield className="w-3 h-3 text-emerald-500" />
                                                {i === 0 ? "SSL 256-bit" : i === 1 ? "رمز پویا" : "کارت‌های شتاب"}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* ══ LEFT COL: Order Summary ═══════════════════════ */}
                        <div className="space-y-4">

                            {/* Cart items */}
                            <Card className="sticky top-6">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2">
                                        <ShoppingBag className="w-5 h-5 text-gold" />
                                        <h5>خلاصه سفارش</h5>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">

                                    {/* Items */}
                                    <div className="space-y-3">
                                        {cartItems.map(item => (
                                            <div key={item.id} className="flex items-center gap-3">
                                                <div className="w-14 h-14 rounded-lg overflow-hidden border border-border shrink-0">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{item.name}</p>
                                                    <p className="text-xs text-muted-foreground">{item.brand}</p>
                                                    <Badge variant="outline" className="text-[10px] mt-1">×{item.qty}</Badge>
                                                </div>
                                                <p className="text-sm font-semibold text-gold shrink-0">
                                                    {formatPrice(item.price)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <Separator />

                                    {/* Discount Code */}
                                    <div>
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

                                    <Separator />

                                    {/* Price Breakdown */}
                                    <div className="space-y-2.5 text-sm">
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>{formatPrice(subtotal)}</span>
                                            <span>جمع کالاها</span>
                                        </div>
                                        {discountApplied && (
                                            <div className="flex justify-between text-emerald-500">
                                                <span>− {formatPrice(discount)}</span>
                                                <span>تخفیف (۱۰٪)</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>{deliveryCost === 0 ? "رایگان" : formatPrice(deliveryCost)}</span>
                                            <span>هزینه ارسال</span>
                                        </div>

                                        <Separator />

                                        <div className="flex justify-between font-bold text-base pt-1">
                                            <span className="text-gold">{formatPrice(total)}</span>
                                            <span>مبلغ قابل پرداخت</span>
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
                                                در حال انتقال...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-2">
                                                <Lock className="w-4 h-4" />
                                                پرداخت از طریق شاپرک
                                            </span>
                                        )}
                                    </Button>

                                    {/* Trust badges */}
                                    <div className="flex items-center justify-center gap-4 pt-1">
                                        {[
                                            { icon: Shield, label: "پرداخت امن" },
                                            { icon: Clock, label: "پشتیبانی ۲۴/۷" },
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
            </main>
        </div >
    );
}