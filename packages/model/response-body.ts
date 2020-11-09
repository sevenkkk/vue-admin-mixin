/**
 * api返回的原有字段
 */
export interface ResponseBody {
    success: boolean;
    errorCode?: string;
    errorMessage?: string;
    payload?: any;
    count?: number;
}

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
