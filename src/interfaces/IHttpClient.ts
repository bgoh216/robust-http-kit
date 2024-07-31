import { HttpResponse } from "./HttpResponse";
import { IErrorHandler } from "./IErrorHandler";
import { IHttpClientConfig } from "./IHttpClientConfig";
import { IRequestMiddleware } from "./IRequestMiddleware";
import { IResponseMiddleware } from "./IResponseMiddleware";

export interface IHttpClient {
    request<T>(config: IHttpClientConfig, errorHandler?: IErrorHandler): Promise<HttpResponse<T>>;
    get<T>(url: string, config?: Partial<IHttpClientConfig>, errorHandler?: IErrorHandler): Promise<HttpResponse<T>>;
    post<T>(url: string, data?: any, config?: Partial<IHttpClientConfig>, errorHandler?: IErrorHandler): Promise<HttpResponse<T>>;
    put<T>(url: string, data?: any, config?: Partial<IHttpClientConfig>, errorHandler?: IErrorHandler): Promise<HttpResponse<T>>;
    delete<T>(url: string, config?: Partial<IHttpClientConfig>, errorHandler?: IErrorHandler): Promise<HttpResponse<T>>;
    patch<T>(url: string, data?: any, config?: Partial<IHttpClientConfig>, errorHandler?: IErrorHandler): Promise<HttpResponse<T>>;
    addRequestMiddleware(middleware: IRequestMiddleware): void;
    addResponseMiddleware(middleware: IResponseMiddleware): void;
}