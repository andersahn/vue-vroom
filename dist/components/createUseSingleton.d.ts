import { type Ref, type ComputedRef } from 'vue';
type R<T> = T | Ref<T | undefined> | ComputedRef<T | undefined>;
type FilterType<Models, Model extends keyof Models> = {
    [key in keyof Models[Model]]?: R<Models[Model][key]>;
};
type OptionsType<Models, Model extends keyof Models> = {
    filter?: R<FilterType<Models, Model>>;
    path?: string;
    loadOnUpdate?: boolean;
};
export default function createUseSingleton<Models>(stores: any): <const ModelName extends keyof Models>(model: ModelName, options?: OptionsType<Models, ModelName>) => {
    item: ComputedRef<Models[ModelName]>;
    refresh: () => void;
    isLoading: ComputedRef<boolean>;
    isFailed: ComputedRef<boolean>;
    error: any;
};
export {};
