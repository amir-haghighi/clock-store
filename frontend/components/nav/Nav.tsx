"use client"
import { useUser } from '@/hooks/useUser';
import React, { useEffect } from 'react'
import { Button } from '../ui/button';
import Link from 'next/link';
import Logout from '../logging/logout';
import { Badge, LogIn, LogInIcon, LogsIcon, LucideLogIn, ShoppingCartIcon, WatchIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';


export const Nav = () => {
    const cartItems = useCartStore(state => state.cartItems)
    console.log({ cartItems })

    let totalItems = 0
    cartItems.forEach((item) => {
        totalItems += item.quantity

    })

    const { user, loading, isAuthenticated } = useUser();
    const pathName = usePathname()

    const navItems = [
        {
            name: "تماس",
            href: "/contact",
        },
        // {
        //     name: "محصولات",
        //     href: "/products",

        // },
        // {
        //     name: "برندها",
        //     href: "/brands",

        // },
        {
            name: "تعمیرات",
            href: "/repair",

        },
        {
            name: "سبد خرید",
            href: "/cart",

        }
    ]



    return (

        <nav className="sticky top-0 z-50 bg-background p-2 flex justify-between items-center">
            <ul className='flex gap-4 items-center '>  <li className={`${pathName === "/" ? "text-foreground" : "text-muted-foreground"} `}>
                <Link href={"/"} >
                    <WatchIcon />
                </Link>
            </li>
                {
                    navItems.map((navItem, index) => {
                        const isActive = pathName === navItem.href
                        const isCart = navItem.href === "/cart"


                        if (isCart) {
                            return (
                                <li key={navItem.name} className='relative'>
                                    <Link href={navItem.href} className={`${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                                        <Button variant={'link'} className='text-inherit gap-0 ' >
                                            <ShoppingCartIcon size={20} />
                                            <span>سبد خرید  </span>
                                            {totalItems > 0 && (
                                                <span className="absolute top-1 right-0 text-xs bg-amber-500 text-white rounded-full w-4 h-4 flex items-center  justify-center">
                                                    {totalItems}
                                                </span>
                                            )}
                                        </Button>

                                    </Link>
                                </li>
                            )

                        }

                        return (
                            <li>
                                <Link href={navItem.href} className={`${isActive ? "text-foreground" : "text-muted-foreground"} `}>
                                    <Button variant={'link'} className='text-inherit' >
                                        {navItem.name}
                                    </Button>

                                </Link>
                            </li>
                        )

                    })
                }


            </ul>
            {
                !isAuthenticated ?

                    <div className='flex gap-2 items-center '>
                        <Button asChild variant={"default"}>
                            <Link href="/login">
                                <LogInIcon />ورود</Link>
                        </Button>
                        <Button asChild variant={"outline"}  >
                            <Link href="/signup"> ثبت نام</Link>
                        </Button>
                    </div>

                    :

                    <Logout />

            }
        </nav >
    )
}
