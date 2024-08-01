import { HttpMethod } from "./HttpMethod";


export type ErrorContext = {
    status?: number;
    statusText?: string;
    data?: unknown;
    headers: Record<string, string>;
    url: string;
    method: HttpMethod;
};
