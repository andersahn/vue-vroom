import { type StoreDefinition } from 'pinia';
import { ID, ApiNames } from './types';
type ItemActions<T, ModelT> = {
    [Property in keyof T]: (id: ModelT['id'], data?: any) => Promise<ModelT>;
};
export default function createStores<Type, ModelInfo>(models: any, baseURL: string | undefined, naming: ApiNames, api: any): { [K in keyof Type]: ModelInfo[K] extends {
    singleton: boolean;
} ? StoreDefinition<K, {
    item: Omit<Type[K], "id">;
}, {}, ItemActions<ModelInfo[K]["itemActions"], Omit<Type[K], "id">> & {
    update: (data: Partial<Type[K]>, filter?: object) => Promise<Omit<Type[K], "id">>;
}> : StoreDefinition<K, {
    items: Type[K][];
}, {
    single: () => (id: ID) => Type[K];
}, ItemActions<ModelInfo[K]["itemActions"], Type[K]> & {
    create: (data: Partial<Type[K]>) => Promise<Type[K]>;
    bulkCreate: (data: Partial<Type[K]>[]) => Promise<Type[K]>;
    update: (id: Type[K]["id"], data: Partial<Type[K]>) => Promise<Type[K]>;
    bulkUpdate: (data: Partial<Type[K]>[]) => Promise<Type[K]>;
    localUpdate: (id: Type[K]["id"], data: Partial<Type[K]>) => Promise<Type[K]>;
    delete: (id: Type[K]["id"]) => Promise<void>;
    bulkDelete: (ids: Type[K]["id"][]) => Promise<void>;
}>; };
export {};
