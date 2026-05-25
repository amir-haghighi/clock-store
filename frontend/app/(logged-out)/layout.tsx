import LightDarkToggle from "@/components/ui/LightDarkToggle"
type Props = {
    children?: React.ReactNode
}
export default function loggedOutLayout({ children }: Props) {
    return (
        <>
            <div className="flex flex-col items-center justify-center   min-h-screen gap-4">
                {children}
            </div>
            <LightDarkToggle className="fixed right-0 top-1/2" />
        </>
    )
}