import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { GenericApiResponse } from "../utils/apiResponse";

export const errorHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    console.error(err);

    if (err instanceof AppError) {
        return GenericApiResponse.error(res, err.message, err.statusCode);
    }

    if (err.name === "SequelizeValidationError") {
        return GenericApiResponse.error(
            res,
            "Validation error",
            400,
            err.errors.map((e: any) => e.message)
        );
    }

    if (err.name === "NoSuchKey") {
        return GenericApiResponse.error(res, "File not found", 404);
    }

    return GenericApiResponse.error(res, "Internal Server Error", 500);
};