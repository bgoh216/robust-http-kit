# robust-http-kit

A flexible and powerful HTTP client for TypeScript with built-in middleware support and customizable error handling.
Idea is a plug-and-play HTTP toolkit library, supporting attaching/dettaching of error handlers, middlewares while strictly enforcing handling of errors.

# Inspiration
![robust-http-kit_idea drawio](https://github.com/user-attachments/assets/7f9113c4-1a1e-4a1c-bec4-40ca8eff037c)


## Features

- Support for both Fetch API and Axios
- Flexible middleware system for request and response processing
- Customizable error handling
- TypeScript support for enhanced developer experience
- Easy-to-use API with consistent interface across different HTTP client implementations

## Installation

```bash
npm install robust-http-kit
```

## Basic Usage

```typescript
import { FetchHttpClient, CustomErrorHandler } from 'robust-http-kit';

const client = new FetchHttpClient({
  baseUrl: 'https://api.example.com',
});

const errorHandler = new CustomErrorHandler();

async function fetchUser(id: number) {
  try {
    const response = await client.get<{ id: number; name: string }>(
      `/users/${id}`,
      { responseType: 'json' },
      errorHandler
    );
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching user:', error);
  }
}

fetchUser(1);
```

## Flexible Error Handling

The `IErrorHandler` interfaces provides template for error handling.  You can customised your `ErrorHandler` to handle suit your needs. It can either return a customised data or throw an error. This allows error objects to be attached and detached as you deem fit.

```typescript
import { IErrorHandler } from "../interfaces/IErrorHandler";
import { ErrorContext } from "../interfaces/ErrorContext";

export class ApiDefaultErrorHandler implements IErrorHandler {
    handleError(error: ErrorContext): any {
        console.error(`Error in ${error.method} request to ${error.url} with ${error.status}`);

        // ...
    }
}


export class MyErrorHandler implements IErrorHandler {
    handleError(error: ErrorContext): any {
        console.error(`Error in ${error.method} request to ${error.url} with ${error.status}`);

        if (error.status == '400') {
          console.error('Bad Request: The server could not understand the request.');
          return { isHandled: true, error: error };
        } 

        if (error.status == '500') {
          console.error('Bad Request: The server could not understand the request.');
          throw error;
        }
    }
}

export class UserErrorHandler implements IErrorHandler {
    handleError(error: ErrorContext): any {
        console.error(`Error in ${error.method} request to ${error.url} with ${error.status}`);

        // ...
    }
}

const client = new FetchHttpClient({ baseUrl: 'https://api.example.com' }, new ApiDefaultErrorHandler());
const myErrorHandler = new MyErrorHandler();
const userErrorHandler = new UserErrorHandler();

// Use the custom error handlers in a request
const response = await client.get('/main', {}, myErrorHandler);
const response = await client.get('/users/1', {}, userErrorHandler);
```

## Middleware

robust-http-kit provides a powerful middleware system for both requests and responses. Here are some examples of built-in middleware:

### Request Middleware

```typescript
import { 
  FetchHttpClient, 
  BearerTokenMiddleware, 
  ApiKeyMiddleware, 
  QueryParamsMiddleware, 
  TimeoutMiddleware 
} from 'robust-http-kit';

const client = new FetchHttpClient({ baseUrl: 'https://api.example.com' });

// Add a bearer token to all requests
client.addRequestMiddleware(new BearerTokenMiddleware('your-token-here'));

// Add an API key to all requests
client.addRequestMiddleware(new ApiKeyMiddleware('your-api-key', 'X-API-Key'));

// Add query parameters to all requests
client.addRequestMiddleware(new QueryParamsMiddleware({ version: '1.0' }));

// Set a timeout for all requests
client.addRequestMiddleware(new TimeoutMiddleware(5000));

// The request will now include the bearer token, API key, query params, and a timeout
const response = await client.get('/users/1');
```

### Response Middleware

```typescript
import { 
  FetchHttpClient, 
  LoggingMiddleware, 
  ResponseTimeMiddleware, 
  DataTransformMiddleware 
} from 'robust-http-kit';

const client = new FetchHttpClient({ baseUrl: 'https://api.example.com' });

// Log all responses
client.addResponseMiddleware(new LoggingMiddleware());

// Measure and log response time
client.addResponseMiddleware(new ResponseTimeMiddleware());

// Transform response data
client.addResponseMiddleware(new DataTransformMiddleware((data) => {
  // Example: Convert all user names to uppercase
  if (data.name) {
    data.name = data.name.toUpperCase();
  }
  return data;
}));

// The response will be logged, timed, and the data will be transformed
const response = await client.get('/users/1');
```

### Custom Middleware

You can create custom middleware by implementing the `RequestMiddleware` or `ResponseMiddleware` interfaces:

```typescript
import { RequestMiddleware, HttpClientConfig } from 'robust-http-kit';

class MyCustomMiddleware implements RequestMiddleware {
  processRequest(config: HttpClientConfig): HttpClientConfig {
    // Modify the config as needed
    return {
      ...config,
      headers: {
        ...config.headers,
        'X-Custom-Header': 'CustomValue'
      }
    };
  }
}

const client = new FetchHttpClient({ baseUrl: 'https://api.example.com' });
client.addRequestMiddleware(new MyCustomMiddleware());
```

## Using Different HTTP Clients

robust-http-kit supports both Fetch API and Axios. You can easily switch between them:

```typescript
import { FetchHttpClient, AxiosHttpClient } from 'robust-http-kit';

// Using Fetch API
const fetchClient = new FetchHttpClient({ baseUrl: 'https://api.example.com' });

// Using Axios
const axiosClient = new AxiosHttpClient({ baseUrl: 'https://api.example.com' });

// The usage remains the same for both clients
const fetchResponse = await fetchClient.get('/users/1');
const axiosResponse = await axiosClient.get('/users/1');
```

## TypeScript Support

robust-http-kit is written in TypeScript and provides full type support:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const client = new FetchHttpClient({ baseUrl: 'https://api.example.com' });

// The response.data will be typed as User
const response = await client.get<User>('/users/1');
console.log(response.data.name); // TypeScript knows that 'name' exists on User
```
