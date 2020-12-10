/**
 * 前端封装的的字段
 */
export interface UseResult<T> {
    success: boolean;
    payload: T;
    errorCode?: string;
    errorMessage?: string;
    totalCount?: number;
}
