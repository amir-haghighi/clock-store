"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { WatchIcon } from 'lucide-react'
import { Controller, useForm } from "react-hook-form"
import Link from 'next/link'
import * as z from "zod"
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { formSchema } from '@/components/signup/FormSchema'
import { PasswordInput } from '@/components/ui/password-input'

import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useSignup } from '@/hooks/useSignup'


function SignupPage() {
    const { mutate: signup } = useSignup()
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({

        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            name: "",
            password: "",
            passwordConfirm: "",
        }
    })
    const onSubmit = async (data: any) => {
        const dataModified = {
            name: data.name,
            email: data.email,
            password: data.password,
        }
        signup(
            dataModified, {

            onSuccess: (data) => {
                router.back()
                toast.success(data.message)
            },
            onError: (error) => {
                toast.success(error.message)
            }
        }
        )
    }
    return (
        <>

            <Link href={"/"}> <WatchIcon size={50} /></Link>
            <Card className='w-full max-w-md  '>
                <CardHeader>
                    <CardTitle className='font-bold text-2xl mb-2'>
                        Signup
                    </CardTitle>
                    <CardDescription>
                        Signup for a new AmirWatch account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="form-rhf" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="name">
                                            name
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="name"
                                            aria-invalid={fieldState.invalid}

                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[{ message: "invalid Name" }]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="email">
                                            Email
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="email"
                                            aria-invalid={fieldState.invalid}

                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[{ message: "invalid Email" }]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="password">
                                            Password
                                        </FieldLabel>
                                        <PasswordInput
                                            {...field}
                                            id="password"
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="passwordConfirm"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="passwordConfirm">
                                            Confirm Password
                                        </FieldLabel>
                                        <PasswordInput
                                            {...field}
                                            id="passwordConfirm"
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Button type="submit" >ثبت نام</Button>
                        </FieldGroup>

                    </form>
                </CardContent>

                <CardFooter className='justify-between '>
                    <small>Already have an account ? </small>
                    <Button asChild variant={"outline"} size="sm">
                        <Link href="/login">ورود</Link>
                    </Button>
                </CardFooter>
            </Card >
        </>
    )
}

export default SignupPage