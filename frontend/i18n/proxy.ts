// src/proxy.ts

import createMiddleware from "next-intl/middleware";
import { routing } from "./routing";
;

console.log("PROXY RUNNING");

export default createMiddleware(routing);

export const config = {
    matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)"
};