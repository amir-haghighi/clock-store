"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Laptop2Icon, ListCheckIcon } from 'lucide-react'

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid } from 'recharts'
import { useTheme } from 'next-themes'
import { dommyTicketsResoledTickets } from './dommyTicketsResoledTickets'

function TeamStatsChart
    () {
    const { resolvedTheme } = useTheme()
    return (
        <Card>
            <CardHeader>
                <CardTitle className='flex  items-center gap-2'>
                    <ListCheckIcon />
                    <h5 className='font-semibold '>Support tickets resolved</h5>

                </CardTitle>
            </CardHeader>
            <CardContent className='pl-0'>
                <ResponsiveContainer height={350} width={"100%"} >
                    <LineChart data={dommyTicketsResoledTickets} >
                        <CartesianGrid strokeDasharray={"3"} />
                        <XAxis fontSize={12} dataKey={"name"} />
                        <YAxis fontSize={12} />
                        <Line dataKey={"delta"} type={'monotone'} stroke="#84cc16" />
                        <Line dataKey={"alpha"} type={'monotone'} stroke="#3b82f6" />
                        <Line dataKey={"canary"} type={'monotone'} stroke="#f97316" />
                        <Tooltip wrapperClassName='rounded-md '
                            // formatter={(value, name) =>
                            //     name === "wfh" ?
                            //         [value, "from home"] :
                            //         [value, "from office"]

                            // }
                            contentStyle={resolvedTheme === "dark" ? { background: "#27272a" } : { background: "#e4e4e7" }}
                            labelClassName='dark:text-zinc-100 text-zinc-800  '
                        />

                    </LineChart>
                </ResponsiveContainer>
            </CardContent>

        </Card>
    )
}

export default TeamStatsChart
