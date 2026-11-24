type PostData<Model> = Partial<Omit<Model, 'id'>>;
type SortSettings = {
    field: string;
    dir?: 'ASC' | 'DESC';
};
type PaginationSettings = {
    page?: number;
    limit?: number;
    cursor?: number | string;
};
export default function createStoreShortHands<Models, IdType>(stores: any): {
    create: <const ModelName extends keyof Models>(model: ModelName, data: PostData<Models[ModelName]>) => Promise<Models[ModelName]>;
    update: <const ModelName extends keyof Models>(model: ModelName, id: Models[ModelName] extends {
        id: infer I;
    } ? I : IdType, data: PostData<Models[ModelName]>) => Promise<Models[ModelName]>;
    delete: <const ModelName extends keyof Models>(model: ModelName, id: Models[ModelName] extends {
        id: infer I;
    } ? I : IdType) => Promise<void>;
    get: <const ModelName extends keyof Models>(model: ModelName, id: Models[ModelName] extends {
        id: infer I;
    } ? I : IdType, settings?: {
        include?: string[];
    }) => Promise<Models[ModelName]>;
    getSingleton: <const ModelName extends keyof Models>(model: ModelName, filter?: {
        [key: string]: any;
    }) => Promise<Models[ModelName]>;
    updateSingleton: <const ModelName extends keyof Models>(model: ModelName, data: PostData<Models[ModelName]>, filter?: {
        [key: string]: any;
    }) => Promise<Models[ModelName]>;
    list: <const ModelName extends keyof Models>(model: ModelName, settings?: {
        filter?: any;
        pagination?: PaginationSettings;
        sort?: SortSettings[];
        include?: string[];
    }) => Promise<Models[ModelName][]>;
};
export {};
