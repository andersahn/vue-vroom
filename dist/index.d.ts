import defineModel from './defineModel';
import createVroom from './createVroom';
import type { VNode } from 'vue';
import ServerError from './ServerError';
export type { VroomDb } from './server/createDb';
type ReadyPayload<Instance> = {
    refresh: () => void;
    create: (data: any) => void;
    pushId: (id: Instance['settings'] extends {
        idsAreNumbers: true;
    } ? number : string) => void;
};
export type FetchListComponent<Instance> = {
    new (): {
        $props: {
            model: Instance extends object ? keyof Instance['types'] : string;
        };
        $emit: {
            (e: 'ready', fetch: ReadyPayload<Instance>): void;
            (e: 'loaded', items: any[]): void;
        };
        $slots: {
            default?: (props: {
                [K in keyof Instance['types'] as `${K}Items`]: Instance['types'][K][];
            } & {
                meta: {
                    nextCursor?: Instance['settings'] extends {
                        idsAreNumbers: true;
                    } ? number : string;
                    page: number;
                    pages: number;
                    results: number;
                    refresh: () => void;
                    create: (data: any) => void;
                    pushId: (id: Instance['settings'] extends {
                        idsAreNumbers: true;
                    } ? number : string) => void;
                };
            }) => VNode[];
            all?: (props: {
                [K in keyof Instance['types'] as `${K}Items`]: Instance['types'][K][];
            } & {
                meta: {
                    nextCursor?: Instance['settings'] extends {
                        idsAreNumbers: true;
                    } ? number : string;
                    page: number;
                    pages: number;
                    results: number;
                    refresh: () => void;
                    create: (data: any) => void;
                    pushId: (id: Instance['settings'] extends {
                        idsAreNumbers: true;
                    } ? number : string) => void;
                };
                isLoading: boolean;
                isFailed: boolean;
                error: {
                    status: number;
                    data?: any;
                };
            }) => VNode[];
            loading?: () => VNode[];
            failed?: (props: {
                error: {
                    status: number;
                    data?: any;
                };
            }) => VNode[];
        };
    };
};
export type FetchSingleComponent<Instance> = {
    new (): {
        $props: {
            model: Instance extends object ? keyof Instance['types'] : string;
            id: Instance['settings'] extends {
                idsAreNumbers: true;
            } ? number : string;
        };
        $emit: {
            (e: 'loaded', item: any): void;
        };
        $slots: {
            default?: (props: {
                [K in keyof Instance['types']]: Instance['types'][K];
            }) => VNode[];
            all?: (props: {
                [K in keyof Instance['types']]: Instance['types'][K];
            } & {
                isLoading: boolean;
                isFailed: boolean;
                error: {
                    status: number;
                    data?: any;
                };
            }) => VNode[];
            loading?: () => VNode[];
            failed?: (props: {
                error: {
                    status: number;
                    data?: any;
                };
            }) => VNode[];
        };
    };
};
export type FetchSingletonComponent<Instance> = {
    new (): {
        $props: {
            model: Instance extends object ? keyof Instance['types'] : string;
        };
        $emit: {
            (e: 'loaded', item: any): void;
        };
        $slots: {
            default?: (props: {
                [K in keyof Instance['types']]: Instance['types'][K];
            }) => VNode[];
            all?: (props: {
                [K in keyof Instance['types']]: Instance['types'][K];
            } & {
                isLoading: boolean;
                isFailed: boolean;
                error: {
                    status: number;
                    data?: any;
                };
            }) => VNode[];
            loading?: () => VNode[];
            failed?: (props: {
                error: {
                    status: number;
                    data?: any;
                };
            }) => VNode[];
        };
    };
};
export { ServerError, defineModel, createVroom };
