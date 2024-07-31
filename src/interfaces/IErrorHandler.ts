import { ErrorContext } from "./ErrorContext";


export interface IErrorHandler {
    handleError(error: ErrorContext): any;
}
