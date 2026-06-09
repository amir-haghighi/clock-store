import MenuItems from './MenuItems'
import MenuTitle from './MenuTitle'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Link } from '@/i18n/navigation'
import LightDarkToggle from '../ui/LightDarkToggle'
import { ClassNameValue } from 'tailwind-merge'
import { cn } from '@/lib/utils'

function MainMenu({ className }: { className?: ClassNameValue }) {
    return (
        <nav className={cn("flex flex-col md:bg-muted overflow-auto p-4", className)}>

            <header className='border-b dark:border-b-black border-b-zinc-300 pb-4 '>
                <MenuTitle />
            </header>
            <ul className='py-4 grow'>
                <MenuItems href='/dashboard' >My Dashboard</MenuItems>
                <MenuItems href='/dashboard/teams' >Teams</MenuItems>
                <MenuItems href='/dashboard/employees' >Employees</MenuItems>
                <MenuItems href='/dashboard/account' >Account</MenuItems>
                <MenuItems href='/dashboard/settings' >Settings</MenuItems>
            </ul>
            <div className='flex gap-2 items-center '>
                <Avatar>
                    <AvatarFallback className='dark:bg-pink-800 dark:text-white  bg-pink-400 text-black' >
                        AH
                    </AvatarFallback>
                </Avatar>
                <Link href="/" className='underline'>Log out</Link>
                <LightDarkToggle className='ml-auto' />
            </div>
        </nav>
    )
}

export default MainMenu