"use client"
import { queryClient } from '@/lib/queryClient'
import { store } from '@/store/store'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { NextIntlClientProvider } from 'next-intl';
type Props = {
    children: React.ReactNode;
    locale: string;
    messages: any;
}
function Providers({
    children,
    locale,
    messages
}: Props) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <Provider store={store}>
                <QueryClientProvider client={queryClient} >
                    <NextIntlClientProvider
                        locale={locale}
                        messages={messages}
                    >
                        {children}
                    </NextIntlClientProvider>
                </QueryClientProvider>
            </Provider>
        </ThemeProvider>
    )
}

export default Providers