import ServerError from './ServerError';
import { FetchRequestOptions } from './types';
type ApiParams = {
    [key: string]: number | string;
};
type ApiBody = {
    [key: string]: unknown;
} | FormData | Array<any>;
export default function createApi(server: any): {
    intercept: {
        error: ((e: ServerError) => void) | null;
    };
    headers: any;
    requestOptions: FetchRequestOptions;
    get(url: string, params?: ApiParams, extraHeaders?: any): any;
    post(url: string, body?: ApiBody, params?: ApiParams, extraHeaders?: any): any;
    patch(url: string, body?: ApiBody, params?: ApiParams, extraHeaders?: any): any;
    delete(url: string, body?: ApiBody, params?: ApiParams, extraHeaders?: any): any;
};
export {};
