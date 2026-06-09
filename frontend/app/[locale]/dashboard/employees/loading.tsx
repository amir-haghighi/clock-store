import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

function loading() {
    return (
        <Card className='max-w-7xl'>
            <CardHeader className='font-semibold text-lg'>
                <span>Employees</span>
                <Skeleton className='h-10 w-full mt-4' />
            </CardHeader>

            <CardContent className='grid grid-cols-[60px_1fr_1fr_1fr_1fr] gap-4 items-center'>
                <Skeleton className='size-10  rounded-full' />
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-full' />
                <Skeleton className='size-10  rounded-full' />
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-full' />
            </CardContent>
        </Card>
    )
}

export default loading