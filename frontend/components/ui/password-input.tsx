"use client"
import { cn } from "@/lib/utils"
import { Input } from "./input"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useState } from "react"

function PasswordInput({ className, type, ...props }: React.ComponentProps<"input">) {
    const [showPasswordState, setShowPasswordState] = useState(false)
    return (
        <div className="relative">
            <Input {...props} className={cn("pr-10", className)}
                type={showPasswordState ? "text" : "password"} />
            <span className="absolute top-1.25 right-1.25 cursor-pointer select-none ">
                {
                    !showPasswordState ?
                        <EyeIcon onClick={() => setShowPasswordState(true)} /> :
                        <EyeOffIcon onClick={() => setShowPasswordState(false)} />
                }

            </span>
        </div>

    )
}

export { PasswordInput }
