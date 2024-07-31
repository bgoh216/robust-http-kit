import { IErrorHandler } from "../interfaces/IErrorHandler";
import { ErrorContext } from "../interfaces/ErrorContext";

export class CustomErrorHandler implements IErrorHandler {
    handleError(error: ErrorContext): void {
        console.error(`Error in ${error.method} request to ${error.url}`);

        switch (error.status) {
            case 400:
                console.error('Bad Request: The server could not understand the request.');
                break;
            case 401:
                console.error('Unauthorized: Authentication is required and has failed or has not been provided.');
            case 403:
                console.error('Forbidden: The server understood the request but refuses to authorize it.');
                break;
            case 404:
                console.error('Not Found: The requested resource could not be found.');
            case 500:
                console.error('Internal Server Error: The server has encountered a situation it does not know how to handle.');
                break;
            default:
                console.error(`Unhandled error status: ${status}`);
        }
    }
}