import { HttpResponse } from "./HttpResponse";
import { IErrorHandler } from "./IErrorHandler";
import { IHttpClientConfig } from "./IHttpClientConfig";
import { IRequestMiddleware } from "./IRequestMiddleware";
import { IResponseMiddleware } from "./IResponseMiddleware";

export interface IHttpClient {
    request<T,E>(config: IHttpClientConfig, errorHandler?: IErrorHandler): Promise<HttpResponse<T> | E>;
    get<T, E>(url: string, config?: Partial<IHttpClientConfig>, errorHandler?: IErrorHandler): Promise<HttpResponse<T> | E>;
    post<T, E>(url: string, data?: unknown, config?: Partial<IHttpClientConfig>, errorHandler?: IErrorHandler): Promise<HttpResponse<T> | E>;
    put<T, E>(url: string, data?: unknown, config?: Partial<IHttpClientConfig>, errorHandler?: IErrorHandler): Promise<HttpResponse<T> | E>;
    delete<T, E>(url: string, config?: Partial<IHttpClientConfig>, errorHandler?: IErrorHandler): Promise<HttpResponse<T> | E>;
    patch<T, E>(url: string, data?: unknown, config?: Partial<IHttpClientConfig>, errorHandler?: IErrorHandler): Promise<HttpResponse<T> | E>;
    addRequestMiddleware(middleware: IRequestMiddleware): void;
    addResponseMiddleware(middleware: IResponseMiddleware): void;
}