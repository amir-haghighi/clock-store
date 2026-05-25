"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { Badge } from "../ui/badge"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type teamsType = {
    id: number,
    name: string,
    membersNumber: number
}

export const teamsColumns: ColumnDef<teamsType>[] = [

    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "membersNumber",
        header: "Number of members",
    },

]