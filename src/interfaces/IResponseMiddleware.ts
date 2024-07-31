import { HttpResponse } from "./HttpResponse";


export interface IResponseMiddleware {
    processResponse<T>(response: HttpResponse<T>): HttpResponse<T>;
}
