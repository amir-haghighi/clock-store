"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "./button"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./pagination"
import { ArrowLeftIcon, ChevronLeft, ChevronLeftIcon, ChevronRightIcon, MoveLeftIcon } from "lucide-react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),

        initialState: {
            pagination: { pageSize: 5 }
        }
    })

    return (
        <div className="overflow-hidden flex flex-col items-center rounded-md border  ">
            <Table className="h-80" >
                <TableHeader >
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className=" grid grid-cols-[100px_1fr_1fr_1fr_1fr] ">
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}
                                        className="pt-2 pb-0  mx-auto"
                                    >

                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody className="flex flex-col gap-2">
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                className=" grid grid-cols-[100px_1fr_1fr_1fr_1fr]"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className=" mx-auto">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className="flex items-center gap-6 space-x-2  py-4 border-e-red-400">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >

                    <ChevronLeftIcon />
                </Button>
                {table.getState().pagination.pageIndex + 1}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <ChevronRightIcon />

                </Button>
            </div>

        </div>
    )
}