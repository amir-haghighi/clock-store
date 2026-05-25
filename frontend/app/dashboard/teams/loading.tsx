import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

function loading() {
    return (
        <Card className='max-w-7xl'>
            <CardHeader className='font-semibold text-lg'>
                <span> Teams</span>
                <Skeleton className='h-10 w-full mt-4' />

            </CardHeader>
            <CardContent className='grid grid-cols-[1fr_1fr] gap-4 items-center'>

                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-full' />

                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-full' />

            </CardContent>
        </Card>
    )
}

export default loading