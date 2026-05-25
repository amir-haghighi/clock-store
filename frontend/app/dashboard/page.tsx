import EmployeesCards from '@/components/dashboard/employees/EmployeesCards'
import EmployeesStatsChart from '@/components/dashboard/employees/EmployeesStatsChart'
import TeamsCards from '@/components/dashboard/teams/TeamsCards'
import TeamsStats from '@/components/dashboard/teams/TeamsStats'
import TeamStatsChart from '@/components/dashboard/teams/TeamsStatsChart'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function dashboardPage() {
    return (
        <>
            <Tabs defaultValue='employees' >
                <TabsList className='mb-4'>
                    <TabsTrigger value='employees' className='cursor-pointer'>
                        Employees stat
                    </TabsTrigger >
                    <TabsTrigger value='teams' className='cursor-pointer'>
                        Teams stat
                    </TabsTrigger>
                </TabsList>
                <TabsContent value='employees' className='flex flex-col gap-6'>
                    <EmployeesCards />
                    <EmployeesStatsChart />
                </TabsContent>
                <TabsContent value='teams' className='flex flex-col gap-6'>
                    <TeamsCards />
                    <TeamStatsChart />
                </TabsContent>
            </Tabs>
        </>
    )
}

export default dashboardPage