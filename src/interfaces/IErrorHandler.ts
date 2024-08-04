import { ErrorContext } from "./ErrorContext";

export interface IErrorHandler {
    handleError<ErrorType>(error: ErrorContext): ErrorType | never;
}
