import { IResponseMiddleware } from "../interfaces/IResponseMiddleware";
import { IRequestMiddleware } from "../interfaces/IRequestMiddleware";
import { IErrorHandler } from "../interfaces/IErrorHandler";
import { ErrorContext } from "../interfaces/ErrorContext";
import { IHttpClientConfig } from "../interfaces/IHttpClientConfig";
import { HttpResponse } from "../interfaces/HttpResponse";
import { IHttpClient } from "../interfaces/IHttpClient";

export class FetchHttpClient implements IHttpClient {
    private baseUrl: string;
    private defaultErrorHandler: IErrorHandler;
    private headers: Record<string, string>;
    private requestMiddlewares: IRequestMiddleware[] = [];
    private responseMiddlewares: IResponseMiddleware[] = [];

    constructor(options: { baseUrl?: string; headers?: Record<string, string> } = {}, defaultErrorHandler: IErrorHandler) {
        this.baseUrl = options.baseUrl || '';
        this.headers = options.headers || {};
        this.defaultErrorHandler = defaultErrorHandler;
    }

    async request<T>(config: IHttpClientConfig, errorHandler?: IErrorHandler): Promise<HttpResponse<T>> {
        const fullUrl = new URL(config.url, this.baseUrl);
        const processedConfig = this.applyRequestMiddlewares(config);

        try {
            const response = await fetch(fullUrl.toString(), {
                method: processedConfig.method,
                headers: { ...this.headers, ...processedConfig.headers },
                body: processedConfig.data ? JSON.stringify(processedConfig.data) : undefined,
                credentials: processedConfig.withCredentials ? 'include' : 'same-origin',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData: T = await this.parseResponse(response, processedConfig.responseType);

            let httpResponse: HttpResponse<T> = {
                data: responseData,
                status: response.status,
                headers: Object.fromEntries(response.headers.entries()),
            };

            httpResponse = this.applyResponseMiddlewares(httpResponse);

            return httpResponse;
        } catch (error: unknown) {
            return this.defaultErrorHandler.handleError(error as ErrorContext);
        }
    }

    get<T>(url: string, config?: Partial<IHttpClientConfig>, errorHandler?: IErrorHandler): Promise<HttpResponse<T>> {
        return this.request<T>({ ...config, method: 'GET', url }, errorHandler);
    }

    post<T>(url: string, data?: any, config?: Partial<IHttpClientConfig>, errorHandler?: IErrorHandler): Promise<HttpResponse<T>> {
        return this.request<T>({ ...config, method: 'POST', url, data }, errorHandler);
    }

    put<T>(url: string, data?: any, config?: Partial<IHttpClientConfig>, errorHandler?: IErrorHandler): Promise<HttpResponse<T>> {
        return this.request<T>({ ...config, method: 'PUT', url, data }, errorHandler);
    }

    delete<T>(url: string, config?: Partial<IHttpClientConfig>, errorHandler?: IErrorHandler): Promise<HttpResponse<T>> {
        return this.request<T>({ ...config, method: 'DELETE', url }, errorHandler);
    }

    patch<T>(url: string, data?: any, config?: Partial<IHttpClientConfig>, errorHandler?: IErrorHandler): Promise<HttpResponse<T>> {
        return this.request<T>({ ...config, method: 'PATCH', url, data }, errorHandler);
    }

    addRequestMiddleware(middleware: IRequestMiddleware): void {
        this.requestMiddlewares.push(middleware);
    }

    addResponseMiddleware(middleware: IResponseMiddleware): void {
        this.responseMiddlewares.push(middleware);
    }

    private applyRequestMiddlewares(config: IHttpClientConfig): IHttpClientConfig {
        return this.requestMiddlewares.reduce((cfg, middleware) => middleware.processRequest(cfg), config);
    }

    private applyResponseMiddlewares<T>(response: HttpResponse<T>): HttpResponse<T> {
        return this.responseMiddlewares.reduce((resp, middleware) => middleware.processResponse(resp), response);
    }

    private async parseResponse(response: Response, responseType?: string): Promise<any> {
        switch (responseType) {
            case 'json':
                return response.json();
            case 'text':
                return response.text();
            case 'blob':
                return response.blob();
            case 'arraybuffer':
                return response.arrayBuffer();
            default:
                return response.json();
        }
    }
}