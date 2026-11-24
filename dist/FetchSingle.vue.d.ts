declare function __VLS_template(): {
    slots: {
        all?(_: {
            isLoading: boolean;
            isFailed: boolean;
            error: any;
        }): any;
        loading?(_: {}): any;
        failed?(_: {
            error: any;
        }): any;
        default?(_: {
            [x: string]: any;
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
    id: {
        type: (StringConstructor | NumberConstructor)[];
        required: true;
    };
    lazy: {
        type: BooleanConstructor;
        default: boolean;
    };
    include: {
        type: () => string[];
        default: () => never[];
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
        type: ObjectConstructor;
        default: undefined;
    };
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    loaded: (...args: any[]) => void;
    "update:modelValue": (...args: any[]) => void;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    model: {
        type: StringConstructor;
        required: true;
    };
    id: {
        type: (StringConstructor | NumberConstructor)[];
        required: true;
    };
    lazy: {
        type: BooleanConstructor;
        default: boolean;
    };
    include: {
        type: () => string[];
        default: () => never[];
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
        type: ObjectConstructor;
        default: undefined;
    };
}>> & {
    onLoaded?: ((...args: any[]) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}, {
    include: string[];
    path: string;
    loadOnUpdate: boolean;
    modelValue: Record<string, any>;
    lazy: boolean;
}>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, __VLS_TemplateResult["slots"]>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
