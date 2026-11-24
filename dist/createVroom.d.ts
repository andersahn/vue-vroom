import type { Settings, FieldTypes, IdType, SnakeCase } from './types';
import { VroomDb } from './server/createDb';
export default function createVroom<Options extends Settings & {
    models: any;
}>(options: Options): {
    install(app: any): void;
    create: <const ModelName extends keyof Options["models"]>(model: ModelName, data: Partial<Omit<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName], "id">>) => Promise<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName]>;
    update: <const ModelName extends keyof Options["models"]>(model: ModelName, id: FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName] extends {
        id: infer I;
    } ? I : IdType<Options>["id"], data: Partial<Omit<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName], "id">>) => Promise<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName]>;
    delete: <const ModelName extends keyof Options["models"]>(model: ModelName, id: FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName] extends {
        id: infer I;
    } ? I : IdType<Options>["id"]) => Promise<void>;
    get: <const ModelName extends keyof Options["models"]>(model: ModelName, id: FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName] extends {
        id: infer I;
    } ? I : IdType<Options>["id"], settings?: {
        include?: string[];
    } | undefined) => Promise<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName]>;
    getSingleton: <const ModelName extends keyof Options["models"]>(model: ModelName, filter?: {
        [key: string]: any;
    } | undefined) => Promise<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName]>;
    updateSingleton: <const ModelName extends keyof Options["models"]>(model: ModelName, data: Partial<Omit<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName], "id">>, filter?: {
        [key: string]: any;
    } | undefined) => Promise<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName]>;
    list: <const ModelName extends keyof Options["models"]>(model: ModelName, settings?: {
        filter?: any;
        pagination?: {
            page?: number;
            limit?: number;
            cursor?: number | string;
        };
        sort?: {
            field: string;
            dir?: "ASC" | "DESC";
        }[];
        include?: string[];
    } | undefined) => Promise<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName][]>;
    api: {
        intercept: {
            error: ((e: import("./ServerError").default) => void) | null;
        };
        headers: any;
        requestOptions: import("./types").FetchRequestOptions;
        get(url: string, params?: {
            [key: string]: string | number;
        }, extraHeaders?: any): any;
        post(url: string, body?: any[] | {
            [key: string]: unknown;
        } | FormData, params?: {
            [key: string]: string | number;
        }, extraHeaders?: any): any;
        patch(url: string, body?: any[] | {
            [key: string]: unknown;
        } | FormData, params?: {
            [key: string]: string | number;
        }, extraHeaders?: any): any;
        delete(url: string, body?: any[] | {
            [key: string]: unknown;
        } | FormData, params?: {
            [key: string]: string | number;
        }, extraHeaders?: any): any;
    };
    db: VroomDb<Options["models"], IdType<Options>["id"], SnakeCase<Options>>;
    settings: Omit<Options, "models">;
    server: import("./server/Server").default<(FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>> extends infer T ? { [K in keyof T]: import("./server/createDb").Collection<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[K]>; } : never) | null, FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ReturnType<Options["identityModel"]>]> | null;
    stores: FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>> extends infer T_1 ? { [K_1 in keyof T_1]: Options["models"][K_1] extends {
        singleton: boolean;
    } ? import("pinia").StoreDefinition<K_1, {
        item: Omit<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[K_1], "id">;
    }, {}, (Options["models"][K_1]["itemActions"] extends infer T_2 ? { [Property in keyof T_2]: (id: Omit<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[K_1], "id">["id"], data?: any) => Promise<Omit<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[K_1], "id">>; } : never) & {
        update: (data: Partial<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[K_1]>, filter?: object) => Promise<Omit<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[K_1], "id">>;
    }> : import("pinia").StoreDefinition<K_1, {
        items: FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[K_1][];
    }, {
        single: () => (id: import("./types").ID) => FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[K_1];
    }, (Options["models"][K_1]["itemActions"] extends infer T_3 ? { [Property_1 in keyof T_3]: (id: FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[K_1]["id"], data?: any) => Promise<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[K_1]>; } : never) & {
        create: (data: Partial<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[K_1]>) => Promise<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[K_1]>;
        bulkCreate: (data: Partial<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[K_1]>[]) => Promise<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[K_1]>;
        update: (id: FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[K_1]["id"], data: Partial<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[K_1]>) => Promise<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[K_1]>;
        bulkUpdate: (data: Partial<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[K_1]>[]) => Promise<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[K_1]>;
        localUpdate: (id: FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[K_1]["id"], data: Partial<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[K_1]>) => Promise<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[K_1]>;
        delete: (id: FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[K_1]["id"]) => Promise<void>;
        bulkDelete: (ids: FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[K_1]["id"][]) => Promise<void>;
    }>; } : never;
    cache: import("pinia").StoreDefinition<"vroom:cache", {
        ids: {
            [key: string]: {
                [i: string]: number;
                [i: number]: number;
            };
        };
        timeout: ReturnType<typeof setTimeout> | null;
    }, {}, {
        subscribe(model: string, ids: import("./types").ID[]): void;
        garbageCollect(): void;
        scheduleGarbageCollection(): void;
        unsubscribe(model: string, ids: import("./types").ID[]): void;
    }>;
    types: FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>;
    useList: <const ModelName extends keyof Options["models"]>(model: ModelName, options?: {
        filter?: ({ [key in keyof FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName]]?: (FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName][key] | import("vue").Ref<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName][key] | undefined> | import("vue").ComputedRef<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName][key] | undefined>) | undefined; } | import("vue").Ref<{ [key in keyof FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName]]?: (FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName][key] | import("vue").Ref<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName][key] | undefined> | import("vue").ComputedRef<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName][key] | undefined>) | undefined; } | undefined> | import("vue").ComputedRef<{ [key in keyof FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName]]?: (FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName][key] | import("vue").Ref<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName][key] | undefined> | import("vue").ComputedRef<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName][key] | undefined>) | undefined; } | undefined>) | undefined;
        pagination?: ({
            page?: number | import("vue").Ref<number | undefined> | import("vue").ComputedRef<number | undefined>;
            limit?: number | import("vue").Ref<number | undefined> | import("vue").ComputedRef<number | undefined>;
            cursor?: ((FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName] extends {
                id: infer I;
            } ? I : IdType<Options>["id"]) | import("vue").Ref<(FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName] extends {
                id: infer I;
            } ? I : IdType<Options>["id"]) | undefined> | import("vue").ComputedRef<(FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName] extends {
                id: infer I;
            } ? I : IdType<Options>["id"]) | undefined>) | undefined;
        } | import("vue").Ref<{
            page?: number | import("vue").Ref<number | undefined> | import("vue").ComputedRef<number | undefined>;
            limit?: number | import("vue").Ref<number | undefined> | import("vue").ComputedRef<number | undefined>;
            cursor?: ((FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName] extends {
                id: infer I;
            } ? I : IdType<Options>["id"]) | import("vue").Ref<(FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName] extends {
                id: infer I;
            } ? I : IdType<Options>["id"]) | undefined> | import("vue").ComputedRef<(FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName] extends {
                id: infer I;
            } ? I : IdType<Options>["id"]) | undefined>) | undefined;
        } | undefined> | import("vue").ComputedRef<{
            page?: number | import("vue").Ref<number | undefined> | import("vue").ComputedRef<number | undefined>;
            limit?: number | import("vue").Ref<number | undefined> | import("vue").ComputedRef<number | undefined>;
            cursor?: ((FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName] extends {
                id: infer I;
            } ? I : IdType<Options>["id"]) | import("vue").Ref<(FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName] extends {
                id: infer I;
            } ? I : IdType<Options>["id"]) | undefined> | import("vue").ComputedRef<(FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName] extends {
                id: infer I;
            } ? I : IdType<Options>["id"]) | undefined>) | undefined;
        } | undefined>) | undefined;
        sort?: ({
            field: keyof FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName] | import("vue").Ref<keyof FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName] | undefined> | import("vue").ComputedRef<keyof FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName] | undefined>;
            dir: "ASC" | "DESC" | import("vue").Ref<"ASC" | "DESC" | undefined> | import("vue").ComputedRef<"ASC" | "DESC" | undefined>;
        }[] | import("vue").Ref<{
            field: keyof FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName] | import("vue").Ref<keyof FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName] | undefined> | import("vue").ComputedRef<keyof FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName] | undefined>;
            dir: "ASC" | "DESC" | import("vue").Ref<"ASC" | "DESC" | undefined> | import("vue").ComputedRef<"ASC" | "DESC" | undefined>;
        }[] | undefined> | import("vue").ComputedRef<{
            field: keyof FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName] | import("vue").Ref<keyof FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName] | undefined> | import("vue").ComputedRef<keyof FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName] | undefined>;
            dir: "ASC" | "DESC" | import("vue").Ref<"ASC" | "DESC" | undefined> | import("vue").ComputedRef<"ASC" | "DESC" | undefined>;
        }[] | undefined>) | undefined;
        include?: ((keyof FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName])[] | import("vue").Ref<(keyof FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName])[] | undefined> | import("vue").ComputedRef<(keyof FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName])[] | undefined>) | undefined;
        mergePages?: boolean;
        path?: string;
        loadOnUpdate?: boolean;
        lazy?: boolean;
        throttle?: number;
    }) => {
        items: import("vue").ComputedRef<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName][]>;
        create: (data: Partial<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName]>) => any;
        pushId: (id: FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName] extends {
            id: infer I_1;
        } ? I_1 : IdType<Options>["id"]) => void;
        refresh: () => void;
        isLoading: import("vue").ComputedRef<boolean>;
        isFailed: import("vue").ComputedRef<boolean>;
        error: any;
        meta: [{
            nextCursor?: (FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName] extends {
                id: infer I_1;
            } ? I_1 : IdType<Options>["id"]) | undefined;
            page: number;
            pages: number;
            results: number;
        } & { [K_2 in keyof Options["models"]]: Options["models"][K_2]["metaTypes"]; }[ModelName]] extends [import("vue").Ref<any>] ? import("vue").Ref<any> & {
            nextCursor?: (FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName] extends {
                id: infer I_1;
            } ? I_1 : IdType<Options>["id"]) | undefined;
            page: number;
            pages: number;
            results: number;
        } & { [K_2 in keyof Options["models"]]: Options["models"][K_2]["metaTypes"]; }[ModelName] : import("vue").Ref<import("vue").UnwrapRef<{
            nextCursor?: (FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName] extends {
                id: infer I_1;
            } ? I_1 : IdType<Options>["id"]) | undefined;
            page: number;
            pages: number;
            results: number;
        } & { [K_2 in keyof Options["models"]]: Options["models"][K_2]["metaTypes"]; }[ModelName]>>;
    };
    useSingle: <const ModelName extends keyof Options["models"]>(model: ModelName, id: (FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName] extends {
        id: infer I;
    } ? I : IdType<Options>["id"]) | import("vue").Ref<(FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName] extends {
        id: infer I;
    } ? I : IdType<Options>["id"]) | undefined> | import("vue").ComputedRef<(FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName] extends {
        id: infer I;
    } ? I : IdType<Options>["id"]) | undefined>, options?: {
        include?: ((keyof FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName])[] | import("vue").Ref<(keyof FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName])[] | undefined> | import("vue").ComputedRef<(keyof FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName])[] | undefined>) | undefined;
        path?: string;
        loadOnUpdate?: boolean;
        lazy?: boolean;
        preferCache?: boolean;
    }) => {
        item: import("vue").ComputedRef<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName]>;
        refresh: () => void;
        isLoading: import("vue").ComputedRef<boolean>;
        isFailed: import("vue").ComputedRef<boolean>;
        error: any;
    };
    useSingleton: <const ModelName extends keyof Options["models"]>(model: ModelName, options?: {
        filter?: ({ [key in keyof FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName]]?: (FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName][key] | import("vue").Ref<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName][key] | undefined> | import("vue").ComputedRef<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName][key] | undefined>) | undefined; } | import("vue").Ref<{ [key in keyof FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName]]?: (FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName][key] | import("vue").Ref<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName][key] | undefined> | import("vue").ComputedRef<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName][key] | undefined>) | undefined; } | undefined> | import("vue").ComputedRef<{ [key in keyof FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName]]?: (FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName][key] | import("vue").Ref<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName][key] | undefined> | import("vue").ComputedRef<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName][key] | undefined>) | undefined; } | undefined>) | undefined;
        path?: string;
        loadOnUpdate?: boolean;
    }) => {
        item: import("vue").ComputedRef<FieldTypes<Options["models"], IdType<Options>, SnakeCase<Options>>[ModelName]>;
        refresh: () => void;
        isLoading: import("vue").ComputedRef<boolean>;
        isFailed: import("vue").ComputedRef<boolean>;
        error: any;
    };
};
