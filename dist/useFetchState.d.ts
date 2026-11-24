export default function useFetchState(loadOnUpdate: boolean): {
    error: any;
    state: import("vue").Ref<"none" | "loading" | "updating" | "failed">;
    hasLoaded: import("vue").Ref<boolean>;
    isLoading: import("vue").ComputedRef<boolean>;
    isFailed: import("vue").ComputedRef<boolean>;
    handleError: (e: any) => void;
};
