"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { WatchIcon } from 'lucide-react'
import { Controller, useForm } from "react-hook-form"
import Link from 'next/link'
import * as z from "zod"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useLogin } from '@/hooks/useLogin'

const formSchema = z.object({
    email: z.string().email(),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
})



function LoginPage() {
    const { mutate: login, isPending, error, data: res, context } = useLogin()
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })
    const onSubmit = async (data: z.infer<typeof formSchema>) => {

        login(
            {
                email: data.email,
                password: data.password,
            },
            {
                onSuccess: (data) => {
                    toast.success(data.message);
                    router.push("/")
                },

                onError: (err: any) => {
                    toast.error(err.message);
                },
            }
        );

    };

    return (


        <>

            <Link href={"/"}>   <WatchIcon size={50} /></Link>
            <Card className='w-full max-w-md  '>
                <CardHeader>
                    <CardTitle className='font-bold text-2xl mb-2'>
                        Login
                    </CardTitle>
                    <CardDescription>
                        Login to your AmirWatch accounts
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
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
                                            <FieldError errors={[fieldState.error]} />
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
                                            password
                                        </FieldLabel>
                                        <PasswordInput
                                            {...field}
                                            id="password"
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                        />
                                        {/* <InputGroupAddon align="block-end">
                                                <InputGroupText className="tabular-nums">
                                                    {field.value.length}/100 characters
                                                </InputGroupText>
                                            </InputGroupAddon> */}
                                        {!fieldState.invalid &&
                                            <FieldDescription>
                                                password : at least 8 characters , one Uppercase
                                            </FieldDescription>}
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Button type="submit" >Log in</Button>
                        </FieldGroup>

                    </form>
                </CardContent>

                <CardFooter className='justify-between'>
                    <small>Don't have an account ? </small>
                    <Button asChild variant={"outline"} size="sm">
                        <Link href="/signup">Sing up</Link>
                    </Button>
                </CardFooter>
            </Card >
        </>
    )
}

export default LoginPage