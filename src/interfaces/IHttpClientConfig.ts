import { HttpMethod } from "./HttpMethod";


export interface IHttpClientConfig {
    method: HttpMethod;
    url: string;
    headers?: Record<string, string>;
    data?: any;
    params?: Record<string, string>;
    responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
    timeout?: number;
    withCredentials?: boolean;
}
