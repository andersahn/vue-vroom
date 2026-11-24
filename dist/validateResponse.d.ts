import { ApiNames } from './types';
export default function createValidator(models: any, naming: ApiNames): {
    list(url: string, params: any, model: string, response: any): void;
    single(url: string, params: any, model: string, response: any): void;
};
