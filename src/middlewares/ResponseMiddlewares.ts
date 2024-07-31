import { IResponseMiddleware } from "../interfaces/IResponseMiddleware";
import { HttpResponse } from "../interfaces/HttpResponse";

export class LoggingMiddleware implements IResponseMiddleware {
  processResponse<T>(response: HttpResponse<T>): HttpResponse<T> {
    console.log(`Response status: ${response.status}`);
    console.log(`Response headers:`, response.headers);
    // Be careful not to log sensitive data in production
    // console.log(`Response data:`, response.data);
    return response;
  }
}

export class ResponseTimeMiddleware implements IResponseMiddleware {
  private startTime: number;

  constructor() {
    this.startTime = Date.now();
  }

  processResponse<T>(response: HttpResponse<T>): HttpResponse<T> {
    const endTime = Date.now();
    const duration = endTime - this.startTime;
    console.log(`Request took ${duration}ms`);
    return response;
  }
}

export class DataTransformMiddleware implements IResponseMiddleware {
  constructor(private transformFn: (data: any) => any) { }

  processResponse<T>(response: HttpResponse<T>): HttpResponse<T> {
    return {
      ...response,
      data: this.transformFn(response.data) as T
    };
  }
}