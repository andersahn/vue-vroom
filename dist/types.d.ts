export type ActionName = 'index' | 'create' | 'read' | 'update' | 'delete' | 'bulk-create' | 'bulk-update' | 'bulk-delete';
export type ID = string | number;
export type HasId = {
    id: ID;
};
export type ServerSettings = {
    enable?: boolean;
    /** Sets the mock server delay in ms */
    delay?: number;
};
export type SimpleModelSettings = {
    /** An array of actions to enable for this model */
    only?: ActionName[];
    /** The plural name of the model, defaults to [name]s */
    plural?: string;
    /** Base path for the model in the API */
    path?: string;
    /** Whether or not to wrap the API return in a data prop. Defaults to true. */
    envelope?: boolean;
    pagination?: {
        type: 'page' | 'cursor';
        defaultLimit: number;
    };
    inverse?: {
        [local: string]: string | null;
    };
};
export type ModelSettings = {
    /** An array of actions to enable for this model */
    only?: ActionName[];
    /** The plural name of the model, defaults to [name]s */
    plural?: string;
    /** Base path for the model in the API */
    path?: string;
    /** Whether or not to wrap the API return in a data prop. Defaults to true. */
    envelope?: boolean;
    singleton?: true;
    pagination?: {
        type: 'page' | 'cursor';
        defaultLimit: number;
    };
    inverse?: {
        [local: string]: string | null;
    };
    listMeta?: {
        [key: string]: {
            type: Function;
        };
    };
};
export type ApiNames = {
    data: string;
    dataSingle: string;
    meta: string;
    included: string;
};
export type FetchRequestOptions = {
    mode?: 'no-cors' | 'cors' | 'same-origin';
    credentials?: 'include' | 'same-origin' | 'omit';
    cache?: 'default' | 'no-cache' | 'reload' | 'force-cache' | 'only-if-cached';
    redirect?: 'manual' | 'follow' | 'error';
    referrerPolicy?: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
};
export type Settings = {
    baseURL?: string;
    server?: ServerSettings;
    idsAreNumbers?: boolean;
    idFactory?: (i: number) => string;
    naming?: {
        [key in keyof ApiNames]?: string;
    };
    identityModel?: any;
    useSnakeCase?: boolean;
};
type RelationMap = {
    [key: string]: () => string;
};
type ModelOf<Models, Name> = Name extends keyof Models ? Models[Name] : never;
type Prop<T, K extends string> = T extends {
    [P in K]: infer V;
} ? V : never;
/**
 * The id type of one model: its own `idsAreNumbers` wins, otherwise the
 * instance-wide default is used.
 */
export type IdOf<Models, Name, DefaultId> = ModelOf<Models, Name> extends {
    idsAreNumbers: true;
} ? number : ModelOf<Models, Name> extends {
    idsAreNumbers: false;
} ? string : DefaultId;
type RelId<One, Models, DefaultId, SnakeCase> = One extends RelationMap ? {
    [K in keyof One & string as SnakeCase extends true ? `${K}_id` : `${K}Id`]: IdOf<Models, ReturnType<One[K]>, DefaultId>;
} : {};
type RelIds<Many, Models, DefaultId, SnakeCase> = Many extends RelationMap ? {
    [K in keyof Many & string as SnakeCase extends true ? `${K}_ids` : `${K}Ids`]?: IdOf<Models, ReturnType<Many[K]>, DefaultId>[];
} : {};
type Related<Models, Name, DefaultId, SnakeCase> = {
    id: IdOf<Models, Name, DefaultId>;
} & Prop<ModelOf<Models, Name>, 'types'> & RelId<Prop<ModelOf<Models, Name>, 'belongsTo'>, Models, DefaultId, SnakeCase>;
export type Rels<Many, Models, DefaultId, SnakeCase> = Many extends RelationMap ? {
    [K in keyof Many]?: Related<Models, ReturnType<Many[K]>, DefaultId, SnakeCase>[];
} : {};
export type Rel<One, Models, DefaultId, SnakeCase> = One extends RelationMap ? {
    [K in keyof One]?: Related<Models, ReturnType<One[K]>, DefaultId, SnakeCase>;
} : {};
export type FieldTypes<Models, Id extends {
    id: ID;
}, SnakeCase> = {
    [K in keyof Models]: Prop<Models[K], 'types'> & {
        id: IdOf<Models, K, Id['id']>;
    } & Rels<Prop<Models[K], 'hasMany'>, Models, Id['id'], SnakeCase> & Rel<Prop<Models[K], 'belongsTo'>, Models, Id['id'], SnakeCase> & RelId<Prop<Models[K], 'belongsTo'>, Models, Id['id'], SnakeCase> & RelIds<Prop<Models[K], 'hasMany'>, Models, Id['id'], SnakeCase>;
};
export type IdType<IdSettings> = IdSettings extends {
    idsAreNumbers: true;
} ? {
    id: number;
} : {
    id: string;
};
export type SnakeCase<CaseSettings> = CaseSettings extends {
    useSnakeCase: true;
} ? true : false;
export {};
