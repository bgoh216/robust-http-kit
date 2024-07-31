import { IRequestMiddleware } from "../interfaces/IRequestMiddleware";
import { IHttpClientConfig } from "../interfaces/IHttpClientConfig";

export class BearerTokenMiddleware implements IRequestMiddleware {
    constructor(private token: string) { }

    processRequest(config: IHttpClientConfig): IHttpClientConfig {
        return {
            ...config,
            headers: {
                ...config.headers,
                'Authorization': `Bearer ${this.token}`
            }
        };
    }
}

export class ApiKeyMiddleware implements IRequestMiddleware {
    constructor(private apiKey: string, private headerName: string = 'X-API-Key') { }

    processRequest(config: IHttpClientConfig): IHttpClientConfig {
        return {
            ...config,
            headers: {
                ...config.headers,
                [this.headerName]: this.apiKey
            }
        };
    }
}

export class QueryParamsMiddleware implements IRequestMiddleware {
    constructor(private params: Record<string, string>) { }

    processRequest(config: IHttpClientConfig): IHttpClientConfig {
        return {
            ...config,
            params: {
                ...config.params,
                ...this.params
            }
        };
    }
}

export class TimeoutMiddleware implements IRequestMiddleware {
    constructor(private timeoutMs: number) { }

    processRequest(config: IHttpClientConfig): IHttpClientConfig {
        return {
            ...config,
            timeout: this.timeoutMs
        };
    }
}