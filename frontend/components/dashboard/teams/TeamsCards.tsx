import { BadgeAlertIcon, BadgeCheckIcon, ChartPieIcon, PartyPopperIcon, StarIcon, UserCheck2Icon, UserIcon, UserRoundXIcon, UsersIcon } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { teamLeaders } from "./dommyTeamLeadersData"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Image from 'next/image';
import TeamDistributionChart from './TeamDistributionChart';

function TeamsCards() {
    const TotalTeams = 8;
    const employeesPresent = 70;
    const percentOfPresentEmployees = (employeesPresent / TotalTeams) * 100
    const areEmployeesEnough = percentOfPresentEmployees >= 70
    return (
        <div className='grid lg:grid-cols-3 gap-4'>
            <Card className='p-4 pt-6'>
                <CardHeader className='pb-2'>
                    <CardTitle className='text-base '>
                        Total Teams
                    </CardTitle>
                </CardHeader>
                <CardContent className='flex justify-between items-center ' >
                    <div className='flex gap-2 '>
                        <UsersIcon />
                        <p className='text-5xl font-bold'>{TotalTeams}</p>
                    </div>
                    <div>
                        <Button size={"sm"} asChild>
                            <Link href={"/dashboard/teams"}>
                                View all
                            </Link>
                        </Button>
                    </div>

                </CardContent>
            </Card>
            <Card className='p-4 pt-6'>
                <CardHeader className='pb-2'>
                    <CardTitle className='text-base flex justify-between items-center '>
                        <span>Team leaders</span>
                        <StarIcon className='text-yellow-500' />
                    </CardTitle>

                </CardHeader>
                <CardContent className='flex  gap-4 flex-wrap w-[95%] '>
                    {teamLeaders.map(leader =>
                        <TooltipProvider>
                            < Tooltip key={`${leader.firstName}${leader.lastName}`}>
                                <TooltipTrigger asChild>
                                    <Avatar size='lg'>
                                        {!!leader.avatar ? <Image src={leader.avatar} alt={`${leader.firstName} ${leader.lastName}`} className='rounded-full' />
                                            : <AvatarFallback>
                                                {leader.firstName[0]}{leader.lastName[0]}
                                            </AvatarFallback>}

                                    </Avatar>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {leader.firstName}{" "}{leader.lastName}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>)
                    }
                </CardContent>

            </Card>
            <Card className='p-4 pt-6'>
                <CardHeader className='pb-2'>
                    <CardTitle className='text-base flex justify-between items-center '>
                        <span>Teams distribution</span>
                        <ChartPieIcon />

                    </CardTitle>
                </CardHeader>
                <CardContent className='flex gap-4 items-center'>
                    <TeamDistributionChart />
                </CardContent>
            </Card>
        </div >
    )
}

export default TeamsCards