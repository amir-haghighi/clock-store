"use client"
import { useUser } from '@/hooks/useUser';
import React from 'react'
import { Button } from '../ui/button';
import Link from 'next/link';
import Logout from '../logging/logout';
import { LogIn, LogInIcon, LogsIcon, LucideLogIn } from 'lucide-react';

export const Nav = () => {
    const { user, loading, isAuthenticated } = useUser();

    return (
        <div className='sticky top-2 ml-auto mr-2 -mt-9'>

            {
                !isAuthenticated ?

                    <div className='flex gap-2 items-center'>
                        <Button asChild variant={"default"}>
                            <Link href="/login">    <LogInIcon />Log in</Link>
                        </Button>
                        <Button asChild variant={"outline"}  >
                            <Link href="/signup"> Sign up</Link>
                        </Button>
                    </div>

                    :

                    <Logout />

            }
        </div>
    )
}
