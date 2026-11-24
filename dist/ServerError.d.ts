export default class ServerError extends Error {
    status: number;
    data: object;
    constructor(status: number, data?: object);
    log(prepend?: string): void;
}
