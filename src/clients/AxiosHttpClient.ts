import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { IResponseMiddleware } from "../interfaces/IResponseMiddleware";
import { IRequestMiddleware } from "../interfaces/IRequestMiddleware";
import { IErrorHandler } from "../interfaces/IErrorHandler";
import { ErrorContext } from "../interfaces/ErrorContext";
import { IHttpClientConfig } from "../interfaces/IHttpClientConfig";
import { HttpResponse } from "../interfaces/HttpResponse";
import { IHttpClient } from '../interfaces/IHttpClient';
import { HttpMethod } from '../interfaces/HttpMethod';

export class AxiosHttpClient implements IHttpClient {
    private axiosInstance: AxiosInstance;
    private defaultErrorHandler: IErrorHandler;
    private requestMiddlewares: IRequestMiddleware[] = [];
    private responseMiddlewares: IResponseMiddleware[] = [];

    constructor(options: { baseUrl?: string; headers?: Record<string, string> } = {}, defaultErrorHandler: IErrorHandler) {
        this.axiosInstance = axios.create({
            baseURL: options.baseUrl,
            headers: options.headers,
        });
        this.defaultErrorHandler = defaultErrorHandler;
    }

    async request<T>(config: IHttpClientConfig, errorHandler: IErrorHandler = this.defaultErrorHandler): Promise<HttpResponse<T>> {
        const processedConfig = this.applyRequestMiddlewares(config);

        try {
            const axiosConfig: AxiosRequestConfig = {
                method: processedConfig.method,
                url: processedConfig.url,
                data: processedConfig.data,
                headers: processedConfig.headers,
                params: processedConfig.params,
                responseType: processedConfig.responseType,
                timeout: processedConfig.timeout,
                withCredentials: processedConfig.withCredentials,
            };

            const response = await this.axiosInstance.request<T>(axiosConfig);

            let httpResponse: HttpResponse<T> = {
                data: response.data,
                status: response.status,
                headers: response.headers as Record<string, string>,
            };

            httpResponse = this.applyResponseMiddlewares(httpResponse);

            return httpResponse;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorContext: ErrorContext = {
                    status: error.response?.status || 0,
                    statusText: error.response?.statusText || error.message,
                    data: error.response?.data,
                    headers: error.response?.headers as Record<string, string>,
                    url: error.config?.url || '',
                    method: error.config?.method?.toUpperCase() as HttpMethod
                }
                return errorHandler.handleError(errorContext) as HttpResponse<T>;
            }

            console.error('Unexpected error:', error);
            throw error;
        }
    }

    get<T>(url: string, config?: Partial<IHttpClientConfig>, errorHandler?: IErrorHandler): Promise<HttpResponse<T>> {
        return this.request<T>({ ...config, method: 'GET', url }, errorHandler);
    }

    post<T>(url: string, data?: unknown, config?: Partial<IHttpClientConfig>, errorHandler?: IErrorHandler): Promise<HttpResponse<T>> {
        return this.request<T>({ ...config, method: 'POST', url, data }, errorHandler);
    }

    put<T>(url: string, data?: unknown, config?: Partial<IHttpClientConfig>, errorHandler?: IErrorHandler): Promise<HttpResponse<T>> {
        return this.request<T>({ ...config, method: 'PUT', url, data }, errorHandler);
    }

    delete<T>(url: string, config?: Partial<IHttpClientConfig>, errorHandler?: IErrorHandler): Promise<HttpResponse<T>> {
        return this.request<T>({ ...config, method: 'DELETE', url }, errorHandler);
    }

    patch<T>(url: string, data?: unknown, config?: Partial<IHttpClientConfig>, errorHandler?: IErrorHandler): Promise<HttpResponse<T>> {
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
}