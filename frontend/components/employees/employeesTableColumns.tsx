"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { Badge } from "../ui/badge"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type EmployeeType = {
    id: number,
    firstName: string,
    lastName: string,
    teamName: string,
    isTeamLeader: boolean,
    avatar?: string
}

export const employeesColumns: ColumnDef<EmployeeType>[] = [
    {
        accessorKey: "avatar",
        header: "",
        cell: ({ row }) => {
            const avatar: string = row.getValue("avatar");
            const firstName: string = row.getValue("firstName");
            const lastName: string = row.getValue("lastName");

            return (<Avatar>
                {!!avatar ?
                    <Image src={avatar} alt={`${firstName[0]}${lastName[0]}`} width={40} height={40} className="rounded-full" /> :
                    <AvatarFallback >
                        {`${firstName[0]}${lastName[0]}`}
                    </AvatarFallback>}
            </Avatar>)
        }
    },
    {
        accessorKey: "firstName",
        header: "First Name",
    },
    {
        accessorKey: "lastName",
        header: "Last Name",
    },
    {
        accessorKey: "teamName",
        header: "Team Name",
    },
    {
        accessorKey: "isTeamLeader",
        header: "Amount",
        cell: ({ row }) => {
            const isTeamLeader = row.getValue("isTeamLeader");
            return (
                isTeamLeader ? <Badge variant={"success"}>
                    Team Leader
                </Badge>
                    : null
            )
        }
    },
]