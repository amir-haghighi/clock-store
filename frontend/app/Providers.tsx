"use client"
import { queryClient } from '@/lib/queryClient'
import { store } from '@/store/store'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'
import { Provider } from 'react-redux'
type Props = { children: ReactNode }
function Providers({ children }: Props) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <Provider store={store}>
                <QueryClientProvider client={queryClient} >




                    {children}


                </QueryClientProvider>
            </Provider>
        </ThemeProvider>
    )
}

export default Providers