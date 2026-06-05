import { Button } from '@/components/ui/button'
import { PersonStandingIcon, WatchIcon } from 'lucide-react'
import Link from 'next/link'
function LoginSignup({ children
}: Readonly<{
    children?: React.ReactNode;
}>) {
    return (
        <div className=' flex flex-col items-center justify-center  gap-6'>
            <Link href={"/"} className='flex gap-2 items-center'>


                <WatchIcon size={40} className='text-pink-400' />

                <h1>AmirWatch</h1>

            </Link>
            <>
                {children}
            </>
            <div className='flex gap-2 items-center'>
                <Button asChild variant={"default"}>
                    <Link href="/login"> ورود</Link>
                </Button>
                <small>or</small>
                <Button asChild variant={"outline"}  >
                    <Link href="/signup"> ثبت نام</Link>
                </Button>
            </div>
        </div>
    )
}

export default LoginSignup