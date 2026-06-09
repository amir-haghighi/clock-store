"use client"
import MainMenu from "@/components/dashboard/MainMenu"
import MenuTitle from "@/components/dashboard/MenuTitle"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { useMediaQuery } from "@/hooks/use-media-query"
import { MenuIcon } from "lucide-react"
type Props = {
    children?: React.ReactNode
}
export default function dashboardLayout({ children }: Props) {
    const isDesktop = useMediaQuery("(min-width:768px)")
    return (
        <div className='md:grid md:grid-cols-[250px_1fr] h-screen'>
            <MainMenu className={"hidden md:flex"} />
            {!isDesktop && <div className="flex justify-between p-4  md:hidden sticky top-0 left-0 bg-background border-b border-border">
                <MenuTitle />
                <Drawer direction="right">
                    <DrawerTrigger className="cursor-pointer    ">
                        <MenuIcon />
                    </DrawerTrigger>
                    <DrawerContent>
                        <MainMenu />
                    </DrawerContent>
                </Drawer>
            </div>}
            <div className="overflow-auto py-2 px-4">
                <h1 className="pb-4">Welcome back, Amir</h1>
                {children}
            </div>
        </div>
    )
}