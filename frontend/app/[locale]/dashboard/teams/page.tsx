
import { teamsData } from '@/components/teams/dommyTeamsTableData'
import { teamsColumns } from '@/components/teams/teamsTableColumns'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { setTimeout } from 'timers/promises'

async function TeamsPage() {
  await setTimeout(1000)
  return (
    <Card className='max-w-7xl'>
      <CardHeader className='font-semibold text-lg'>
        Teams
      </CardHeader>
      <CardContent >
        <DataTable data={teamsData} columns={teamsColumns} />
      </CardContent>
    </Card>
  )
}

export default TeamsPage