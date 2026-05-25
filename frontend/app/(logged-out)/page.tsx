"use client"
import Logout from '@/components/logging/logout'
import { Button } from '@/components/ui/button'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { WatchIcon } from 'lucide-react'
import Link from 'next/link'
function Home() {
    const { user, loading, isAuthenticated } = useCurrentUser();
    if (loading) {
        return <div>Loading...</div>;
    }
    console.log({ isAuthenticated })
    return (
        <>

            <span className='flex flex-col gap-2 items-center'>
                <Link href={"/"}> <WatchIcon size={50} className='text-pink-400  ' /></Link>
                {!!user?.name && <h1>Hello {user.name}</h1>}

                <h1>AmirWatch</h1>
            </span>
            {
                !isAuthenticated ?
                    <>
                        <p>login to see world of watches</p>
                        <div className='flex gap-2 items-center'>
                            <Button asChild variant={"default"}>
                                <Link href="/login"> Log in</Link>
                            </Button>
                            <small>or</small>
                            <Button asChild variant={"outline"}  >
                                <Link href="/signup"> Sign up</Link>
                            </Button>
                        </div>
                    </>
                    :
                    <Logout />

            }

        </>
    )
}

export default Home