import type { ActionName, ApiNames, ModelSettings, ServerSettings, Settings } from '../types';
type RouteMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
type RawRequest = {
    method: RouteMethod;
    url: string;
    body?: string;
    headers: {
        [key: string]: string;
    };
};
type RouteHandler = (request: Request, db: any, server?: any) => void;
type CustomRouteHandler<Db, IdentityModel> = (request: SimpleRequest<IdentityModel>, db: Exclude<Db, null>) => void;
type Route = {
    method: RouteMethod;
    path: string;
    handler: RouteHandler;
    model: string;
    settings: ModelSettings;
};
type ModelDefinition = {
    [key: string]: ModelSettings;
};
type Filter<Db> = {
    [K in keyof Partial<Db>]: {
        [field: string]: (item: Db[K]['items'][0], value: string, db: Db) => boolean;
    };
};
type MetaFields<Db> = {
    [K in keyof Partial<Db>]: {
        [field: string]: (items: Db[K]['items'], db: Db) => any;
    };
};
type Sorters<Db> = {
    [K in keyof Partial<Db>]: {
        [field: string]: (a: Db[K]['items'][0], b: Db[K]['items'][0], dir: number, db: Db) => number;
    };
};
type SideEffect<Db, IdentityModel> = {
    [K in keyof Partial<Db>]: {
        index?: (items: Db[K]['items'][0][], db: Db, request: SimpleRequest<IdentityModel>) => Db[K]['items'][0][] | void;
        create?: (item: Db[K]['items'][0], db: Db, request: SimpleRequest<IdentityModel>) => Db[K]['items'][0] | void;
        read?: (item: Db[K]['items'][0], db: Db, request: SimpleRequest<IdentityModel>) => Db[K]['items'][0] | void;
        update?: (item: Db[K]['items'][0], db: Db, request: SimpleRequest<IdentityModel>) => Db[K]['items'][0] | void;
        delete?: (item: Db[K]['items'][0], db: Db, request: SimpleRequest<IdentityModel>) => void;
    };
};
type SimpleRequest<IdentityModel> = {
    json: object;
    form: object;
    query: object;
    headers: object;
    params: {
        [key: string]: string;
    };
    identity?: IdentityModel;
};
export type Request = {
    json: object;
    form: object;
    query: object;
    params: {
        [key: string]: string;
    };
    model: string;
    settings: ModelSettings;
    headers: object;
    filters: {
        [field: string]: (item: any, value: string, db: any) => boolean;
    };
    sideEffects: {
        [action in ActionName]?: (item: any, db: any, data?: any) => any | void;
    };
    identity: any;
    sorters: {
        [field: string]: (a: any, b: any, dir: number, db: any) => number;
    };
    metaFieldMethods: {
        [field: string]: (items: any, db: any) => any;
    };
};
export default class Server<DbType, IdentityModel> {
    protected routes: Route[];
    protected customRoutes: Route[];
    protected overrides: Route[];
    protected db: DbType;
    identityModel: string;
    identity: IdentityModel | null;
    protected baseURL: string;
    protected settings: ServerSettings;
    protected idsAreNumbers: boolean;
    protected filters: Filter<DbType>;
    protected sideEffects: SideEffect<DbType, IdentityModel>;
    protected metaFields: MetaFields<DbType>;
    protected sorters: Sorters<DbType>;
    protected addDevtoolsEvent: ((event: any) => void) | undefined;
    protected events: any[];
    naming: ApiNames;
    constructor(settings: Settings, models: ModelDefinition, db: DbType);
    /** Reset the server: truncates all db collections and removes overriden routes */
    reset(): void;
    /** Overwrite the response delay */
    setDelay(delay: number): void;
    protected generateRoutes(models: ModelDefinition): void;
    protected addCustomRoute(method: RouteMethod, path: string, handler: CustomRouteHandler<DbType, IdentityModel>): void;
    protected override(method: RouteMethod, path: string, handler: CustomRouteHandler<DbType, IdentityModel>): void;
    /** Add a custom GET route */
    get(path: string, handler: CustomRouteHandler<DbType, IdentityModel>): void;
    /** Add a custom PATCH route */
    patch(path: string, handler: CustomRouteHandler<DbType, IdentityModel>): void;
    /** Add a custom POST route */
    post(path: string, handler: CustomRouteHandler<DbType, IdentityModel>): void;
    /** Add a custom DELETE route */
    delete(path: string, handler: CustomRouteHandler<DbType, IdentityModel>): void;
    /** Add a temporary GET route (will be removed if server.reset is called) */
    overrideGet(path: string, handler: CustomRouteHandler<DbType, IdentityModel>): void;
    /** Add a temporary PATCH route (will be removed if server.reset is called) */
    overridePatch(path: string, handler: CustomRouteHandler<DbType, IdentityModel>): void;
    /** Add a temporary POST route (will be removed if server.reset is called) */
    overridePost(path: string, handler: CustomRouteHandler<DbType, IdentityModel>): void;
    /** Add a temporary DELETE route (will be removed if server.reset is called) */
    overrideDelete(path: string, handler: CustomRouteHandler<DbType, IdentityModel>): void;
    protected parseQuery(search: string): {
        [key: string]: any;
    };
    protected parseUrl(url: string, baseURL: string): {
        path: string;
        query: {
            [key: string]: any;
        };
    };
    protected getJsonBody(str: string): any;
    protected findMatchingRoute(method: RouteMethod, path: string): {
        route: Route;
        params: {
            [key: string]: string;
        };
    } | {
        route: null;
        params: null;
    };
    protected parseRequest({ method, url, body, headers }: RawRequest, baseURL: string): void;
    handleRequest(method: RouteMethod, url: string, body: string, headers: {
        [key: string]: string;
    }): Promise<void>;
    /** Add one or more custom filters */
    addFilters(obj: Filter<DbType>): void;
    /** Add one or more custom meta fields */
    addMetaFields(obj: MetaFields<DbType>): void;
    /** Add on or more sideffects */
    addSideEffects(obj: SideEffect<DbType, IdentityModel>): void;
    /** Add one or more custom sorters */
    addSorters(obj: Sorters<DbType>): void;
    protected logEvent(title: string, subtitle: string, data: any, logType?: string): void;
    protected setDevTools(fn: (event: any) => void): void;
}
export {};
