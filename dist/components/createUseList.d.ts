import { type Ref, type ComputedRef } from 'vue';
type R<T> = T | Ref<T | undefined> | ComputedRef<T | undefined>;
type FilterType<Models, Model extends keyof Models> = {
    [key in keyof Models[Model]]?: R<Models[Model][key]>;
};
type SortType<Models, Model extends keyof Models> = {
    field: R<keyof Models[Model]>;
    dir: R<'ASC' | 'DESC'>;
}[];
type PaginationSettings<IdType> = {
    page?: R<number>;
    limit?: R<number>;
    cursor?: R<IdType>;
};
type IncludeType<Models, Model extends keyof Models> = Array<keyof Models[Model]>;
type OptionsType<Models, Model extends keyof Models, IdType> = {
    filter?: R<FilterType<Models, Model>>;
    pagination?: R<PaginationSettings<IdType>>;
    sort?: R<SortType<Models, Model>>;
    include?: R<IncludeType<Models, Model>>;
    mergePages?: boolean;
    path?: string;
    loadOnUpdate?: boolean;
    lazy?: boolean;
    throttle?: number;
};
export default function createUseList<Models, IdType, ListMetaTypes>(models: any, stores: any, cache: any): <const ModelName extends keyof Models>(model: ModelName, options?: OptionsType<Models, ModelName, Models[ModelName] extends {
    id: infer I;
} ? I : IdType>) => {
    items: ComputedRef<Models[ModelName][]>;
    create: (data: Partial<Models[ModelName]>) => any;
    pushId: (id: Models[ModelName] extends {
        id: infer I;
    } ? I : IdType) => void;
    refresh: () => void;
    isLoading: ComputedRef<boolean>;
    isFailed: ComputedRef<boolean>;
    error: any;
    meta: [{
        nextCursor?: Models[ModelName] extends {
            id: infer I;
        } ? I : IdType;
        page: number;
        pages: number;
        results: number;
    } & ListMetaTypes[ModelName]] extends [Ref<any>] ? Ref<any> & {
        nextCursor?: Models[ModelName] extends {
            id: infer I;
        } ? I : IdType;
        page: number;
        pages: number;
        results: number;
    } & ListMetaTypes[ModelName] : Ref<import("vue").UnwrapRef<{
        nextCursor?: Models[ModelName] extends {
            id: infer I;
        } ? I : IdType;
        page: number;
        pages: number;
        results: number;
    } & ListMetaTypes[ModelName]>>;
};
export {};
