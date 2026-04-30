import { Response } from "express";
import { ApiResponse } from "../types";

export class GenericApiResponse {
    static success<T>(
        res: Response,
        data: T,
        message = "Success",
        statusCode = 200
    ) {
        const response: ApiResponse<T> = {
            success: true,
            message,
            data,
        };

        return res.status(statusCode).json(response);
    }

    static error(
        res: Response,
        message = "Something went wrong",
        statusCode = 500,
        error?: any
    ) {
        const response: ApiResponse = {
            success: false,
            message,
            error,
        };

        return res.status(statusCode).json(response);
    }
}