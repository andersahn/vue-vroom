import type { ID } from './types';
type Cache = {
    [key: string]: {
        [i: ID]: number;
    };
};
export default function createCache(stores: any): import("pinia").StoreDefinition<"vroom:cache", {
    ids: Cache;
    timeout: ReturnType<typeof setTimeout> | null;
}, {}, {
    subscribe(model: string, ids: ID[]): void;
    garbageCollect(): void;
    scheduleGarbageCollection(): void;
    unsubscribe(model: string, ids: ID[]): void;
}>;
export {};
