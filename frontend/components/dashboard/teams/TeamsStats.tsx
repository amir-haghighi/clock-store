"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Laptop2Icon } from 'lucide-react'

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { useTheme } from 'next-themes'
import { data } from '../employees/dommyDataForChart'

function TeamsStats() {
    const { resolvedTheme } = useTheme()
    return (
        <Card>
            <CardHeader>
                <CardTitle className='flex  items-center gap-2'>
                    <Laptop2Icon />
                    <h5 className='font-semibold ' >Employees work location trends</h5>

                </CardTitle>
            </CardHeader>
            <CardContent className='pl-0'>
                <ResponsiveContainer height={350} width={"100%"} >
                    <BarChart data={data} >
                        <XAxis dataKey={"name"} stroke="#888888" fontSize={12} />
                        <YAxis stroke="#888888" fontSize={12} />
                        <Tooltip wrapperClassName='rounded-md '
                            formatter={(value, name) =>
                                name === "wfh" ?
                                    [value, "from home"] :
                                    [value, "from office"]

                            }
                            contentStyle={resolvedTheme === "dark" ? { background: "#27272a" } : { background: "#e4e4e7" }}
                            labelClassName='dark:text-zinc-100 text-zinc-800  '
                        />
                        <Legend iconType='circle' formatter={(value) =>
                            value === "wfh" ?
                                <p>Work from home</p> :
                                <p>Work from office</p>
                        } />
                        <Bar dataKey={"office"} stackId={1} fill="#ec4899" />
                        <Bar dataKey={"wfh"} stackId={1} radius={[4, 4, 0, 0]} fill="gray" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>

        </Card>
    )
}

export default TeamsStats