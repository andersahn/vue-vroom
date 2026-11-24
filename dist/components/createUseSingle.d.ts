import { type Ref, type ComputedRef } from 'vue';
type R<T> = T | Ref<T | undefined> | ComputedRef<T | undefined>;
type IncludeType<Models, Model extends keyof Models> = Array<keyof Models[Model]>;
type OptionsType<Models, Model extends keyof Models> = {
    include?: R<IncludeType<Models, Model>>;
    path?: string;
    loadOnUpdate?: boolean;
    lazy?: boolean;
    preferCache?: boolean;
};
export default function createUseSingle<Models, IdType>(models: any, stores: any, cache: any): <const ModelName extends keyof Models>(model: ModelName, id: R<Models[ModelName] extends {
    id: infer I;
} ? I : IdType>, options?: OptionsType<Models, ModelName>) => {
    item: ComputedRef<Models[ModelName]>;
    refresh: () => void;
    isLoading: ComputedRef<boolean>;
    isFailed: ComputedRef<boolean>;
    error: any;
};
export {};
