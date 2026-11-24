declare const helper: {
    casing: "camel" | "snake";
    setCasing(casing: "camel" | "snake"): void;
    getBelongsToPostFix(): "Id" | "_id" | undefined;
    getHasManyPostFix(): "Ids" | "_ids" | undefined;
    removeHasManyPostfix(fieldName: string): string;
    addBelongsToPostFix(fieldName: string): string;
    addHasManyPostFix(fieldName: string): string;
};
export default helper;
