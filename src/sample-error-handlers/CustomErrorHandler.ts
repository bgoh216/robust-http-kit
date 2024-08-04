import { IErrorHandler } from "../interfaces/IErrorHandler";
import { ErrorContext } from "../interfaces/ErrorContext";

export class CustomErrorHandler implements IErrorHandler {
    // Other informations such as counts, users failed, etc...
    // Can be parked here
    // Can be used as a Singleton pattern to log out these informations

    handleError<ErrorType>(errorContext: ErrorContext): ErrorType | never {
        if (errorContext.status == 300) {
            console.log('Redirecting');
            return { isRedirected: true, url: 'new-redirected-url' } as ErrorType;
        }

        if (errorContext.status == 400) {
            console.warn('Bad request');
        }
    
        if (errorContext.status == 500) {
            console.error('Internal Server Error');
            throw errorContext;
        }
    
        throw new Error("Method not implemented.");
    }
}