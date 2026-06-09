"use client";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "./tooltip";

import { LanguagesIcon } from "lucide-react";
import { Button } from "./button";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";

type Props = {
    className?: string;
};

function LangToggle({ className }: Props) {

    const locale = useLocale();
    const isFa = locale === "fa";
    const router = useRouter();
    const pathname = usePathname();
    const toggle = () => {
        const nextLocale = isFa ? "en" : "fa";
        router.replace(pathname, { locale: nextLocale });
    };



    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        className={className}
                        onClick={toggle}
                    >

                        <LanguagesIcon />

                    </Button>
                </TooltipTrigger>

                <TooltipContent>
                    {isFa ? (
                        <span>Switch to English</span>
                    ) : (
                        <span>تغییر به فارسی</span>
                    )}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export default LangToggle;