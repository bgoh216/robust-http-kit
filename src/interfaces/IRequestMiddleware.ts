import { IHttpClientConfig } from "./IHttpClientConfig";


export interface IRequestMiddleware {
    processRequest(config: IHttpClientConfig): IHttpClientConfig;
}
