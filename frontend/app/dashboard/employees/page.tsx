import { employeesData } from '@/components/employees/dommyEmployeesTableData'
import { employeesColumns } from '@/components/employees/employeesTableColumns'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import React from 'react'
import { setTimeout } from 'timers/promises'

async function EmployeesPage() {
  await setTimeout(1000)
  return (
    <Card className='max-w-7xl'>
      <CardHeader className='font-semibold text-lg'>
        Employees
      </CardHeader>
      <CardContent >
        <DataTable data={employeesData} columns={employeesColumns} />
      </CardContent>
    </Card>
  )
}

export default EmployeesPage