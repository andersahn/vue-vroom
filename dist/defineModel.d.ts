import type { SimpleModelSettings } from './types';
type RequiredFields<Fields, K extends keyof Fields> = Fields[K] extends {
    optional: boolean;
} ? never : K;
type OptionalFields<Fields, K extends keyof Fields> = Fields[K] extends {
    optional: boolean;
} ? K : never;
type SchemaType<Fields> = {
    [K in keyof Fields as RequiredFields<Fields, K>]: Fields[K] extends {
        nullable: boolean;
    } ? ReturnType<Fields[K]['type']> | null : ReturnType<Fields[K]['type']>;
} & {
    [K in keyof Fields as OptionalFields<Fields, K>]?: Fields[K] extends {
        nullable: boolean;
    } ? ReturnType<Fields[K]['type']> | null : ReturnType<Fields[K]['type']>;
};
type IA<Type> = {
    [action: string]: (item: Type) => Partial<Type>;
};
export default function defineModel<Schema, HasMany, BelongsTo, ItemActions extends IA<SchemaType<Schema>>, const Singleton, const Includable, const ListMeta, const IdsAreNumbers extends boolean | undefined = undefined>({ schema, belongsTo, hasMany, itemActions, singleton, includable, listMeta, idsAreNumbers, ...settings }: {
    schema: Schema;
    itemActions?: ItemActions;
    belongsTo?: BelongsTo;
    hasMany?: HasMany;
    singleton?: Singleton;
    includable?: Includable;
    listMeta?: ListMeta;
    /** Overrides the instance-wide `idsAreNumbers` for this model only */
    idsAreNumbers?: IdsAreNumbers;
} & SimpleModelSettings): {
    only?: import("./types").ActionName[];
    plural?: string;
    path?: string;
    envelope?: boolean;
    pagination?: {
        type: "page" | "cursor";
        defaultLimit: number;
    };
    inverse?: {
        [local: string]: string | null;
    };
    schema: Schema;
    hasMany: HasMany;
    belongsTo: BelongsTo;
    itemActions: ItemActions;
    types: SchemaType<Schema>;
    singleton: Singleton;
    includable: Includable;
    listMeta: ListMeta;
    metaTypes: SchemaType<ListMeta>;
    idsAreNumbers: IdsAreNumbers;
};
export {};
