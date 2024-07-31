import { HttpMethod } from "./HttpMethod";


export type ErrorContext = {
    status?: number;
    statusText?: string;
    data?: any;
    headers: Record<string, string>;
    url: string;
    method: HttpMethod;
};
