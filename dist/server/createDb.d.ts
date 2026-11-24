import type { FieldTypes, HasId, ID } from '../types';
type Relation = {
    [K: string]: () => string;
};
type RelationUpdate = {
    name: string;
    model: string;
    id: ID;
    newId: ID;
    oldId?: ID;
};
type Schema = {
    [k: string]: {
        type: () => any;
        optional?: boolean;
    };
};
export declare class Collection<Type extends HasId> {
    db: any;
    model: string;
    schema: Schema;
    items: Type[];
    belongsTo: Relation;
    hasMany: Relation;
    inverse: {
        [field: string]: string;
    };
    lastId: number;
    idsAreNumbers: boolean;
    idFactory: (i: number) => string;
    addDevtoolsEvent: ((title: string, subtitle: string, data: any) => void) | undefined;
    constructor(model: string, schema: Schema, belongsTo: Relation, hasMany: Relation, inverse: any, idsAreNumbers: boolean, idFactory: any, db: any);
    find(id: Type['id']): Type | undefined;
    where(filter: (item: Type) => boolean): Type[];
    count(filter?: (item: Type) => boolean): number;
    first(): Type | null;
    all(): Type[];
    createId(): string | number;
    createMany(...items: Partial<Type>[]): Type[];
    findInverse(field: string): string | undefined;
    updateRelations(relationsToUpdate: RelationUpdate[], relationsToRemove: RelationUpdate[]): void;
    create(json: Partial<Type>): Type;
    pushRelation(model: string, id: Type['id'], relationId: Type['id'], force: string | null | undefined): void;
    removeRelation(model: string, id: Type['id'], relationId: Type['id'], force?: string): void;
    getRelated(id: Type['id'], key: string): any;
    getRelatedModelName(key: string): string;
    update(id: Type['id'], json: Partial<Type>): Type;
    destroy(id: Type['id']): void;
    truncate(): void;
}
type Database<Models> = {
    [K in keyof Models]: Collection<Models[K]>;
};
export type VroomDb<Models, ModelId extends ID, SnakeCase> = Database<FieldTypes<Models, {
    id: ModelId;
}, SnakeCase>>;
export default function createDb<ModelTypes>(options: any): Database<ModelTypes>;
export {};
