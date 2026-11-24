type SortSettings = {
    field: string;
    dir?: 'ASC' | 'DESC';
};
type PaginationSettings = {
    page?: number;
    limit?: number;
    cursor?: number | string;
};
declare function __VLS_template(): {
    slots: {
        all?(_: {
            isLoading: boolean;
            isFailed: boolean;
            error: any;
            meta: any;
        }): any;
        loading?(_: {}): any;
        failed?(_: {
            error: any;
        }): any;
        default?(_: {
            [x: string]: any;
            meta: any;
        }): any;
    };
    refs: {};
    attrs: Partial<{}>;
};
type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;
declare const __VLS_component: import("vue").DefineComponent<{
    model: {
        type: StringConstructor;
        required: true;
    };
    include: {
        type: () => string[];
        default: () => never[];
    };
    pagination: {
        type: () => PaginationSettings;
        default: () => {};
    };
    filter: {
        type: ObjectConstructor;
        default: () => {};
    };
    sort: {
        type: () => SortSettings[];
        default: () => never[];
    };
    mergePages: {
        type: BooleanConstructor;
        default: boolean;
    };
    loadOnUpdate: {
        type: BooleanConstructor;
        default: boolean;
    };
    path: {
        type: StringConstructor;
        default: null;
    };
    modelValue: {
        type: ArrayConstructor;
        default: null;
    };
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    ready: (...args: any[]) => void;
    loaded: (...args: any[]) => void;
    "update:modelValue": (...args: any[]) => void;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    model: {
        type: StringConstructor;
        required: true;
    };
    include: {
        type: () => string[];
        default: () => never[];
    };
    pagination: {
        type: () => PaginationSettings;
        default: () => {};
    };
    filter: {
        type: ObjectConstructor;
        default: () => {};
    };
    sort: {
        type: () => SortSettings[];
        default: () => never[];
    };
    mergePages: {
        type: BooleanConstructor;
        default: boolean;
    };
    loadOnUpdate: {
        type: BooleanConstructor;
        default: boolean;
    };
    path: {
        type: StringConstructor;
        default: null;
    };
    modelValue: {
        type: ArrayConstructor;
        default: null;
    };
}>> & {
    onReady?: ((...args: any[]) => any) | undefined;
    onLoaded?: ((...args: any[]) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}, {
    include: string[];
    sort: SortSettings[];
    filter: Record<string, any>;
    path: string;
    pagination: PaginationSettings;
    mergePages: boolean;
    loadOnUpdate: boolean;
    modelValue: unknown[];
}>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, __VLS_TemplateResult["slots"]>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
