
"use client";

import { Controller, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Truck, Package } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useTranslations } from "next-intl";

type PropsType = {
    DELIVERY_OPTIONS: {
        id: string;
        label: string;
        price: number;
    }[];
    form: UseFormReturn<{
        fullName: string;
        phone: string;
        email: string;
        province: string;
        city: string;
        address: string;
        postalCode: string;
        delivery: "express" | "normal";
        discountCode?: string | undefined;
    }, any, {
        fullName: string;
        phone: string;
        email: string;
        province: string;
        city: string;
        address: string;
        postalCode: string;
        delivery: "express" | "normal";
        discountCode?: string | undefined;
    }>
    formatPrice: (n: number) => string

}
// ─── main  ────────────────────────────────────────────────────────────
const CheckoutForm = ({ formatPrice, form, DELIVERY_OPTIONS }: PropsType) => {
    // ─── translations ─────────────────────────────────────────────────
    const t = useTranslations("checkout");
    return (
        < div className="lg:col-span-7 space-y-6" >
            {/* ── Shipping Info ── */}
            < Card >
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
            </Card >
            {/* ── Delivery Method ── */}
            < Card >
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
            </Card >
        </div >


    )
}

export default CheckoutForm