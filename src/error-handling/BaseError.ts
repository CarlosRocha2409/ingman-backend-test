import { ThttpStatusCode } from "../types/error.type";

export class BaseError extends Error {
  name: string;
  statusCode: ThttpStatusCode;
  isOperational: boolean;
  constructor(
    name: string,
    statusCode: ThttpStatusCode,
    isOperational: boolean,
    description: string
  ) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this);
  }
}
