import type { Response } from "express"


type ApiResponse<T = unknown> = {
    message: string
    status: "fail" | "success"
    code?: string,
    data?: T
    pagination?: {
        page: number,
        pages: number,
        total: number

    }
}

export type ResType<T = unknown> = Response<ApiResponse<T>>
