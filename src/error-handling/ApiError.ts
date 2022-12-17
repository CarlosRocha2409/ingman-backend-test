import { NOT_FOUND, ThttpStatusCode } from "../types/error.type";
import { BaseError } from "./BaseError";

export class ApiError extends BaseError {
  constructor(
    description = "Not found.",
    statusCode: ThttpStatusCode = NOT_FOUND,
    name = "Api Error",
    isOperational = true
  ) {
    super(description, statusCode, isOperational, name);
  }
}
