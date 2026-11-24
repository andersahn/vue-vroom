export declare function parseFilterField(field: string): {
    name: string;
    fn: any;
};
export declare function paginateItems(items: any[], page: number, limit: number): {
    paginatedItems: any[];
    paginationMeta: {
        page: number;
        results: number;
        pages: number;
    };
};
export declare function cursorPaginate(items: any[], cursor: string | number, limit: number): {
    paginatedItems: any[];
    paginationMeta: {
        nextCursor: any;
    };
};
export declare function sortItems(items: any[], sortStr: string, sorters: any, db: any): any[];
