import { VdConfirmInfo } from './request-options';

/**
 * 配置选项
 */
export interface VdConfigOptions {
    showSuccessMessage(message: string): void; // 成功提示消息
    showErrorMessage(message: string): void; // 失败提示消息
    showMessage401: boolean; // 是否显示401消息
    message401: string; // 提示401消息
    handle401(message: string): void; // 401处理
    showMessage403: boolean; // 是否显示403消息
    message403: string; // 提示403消息
    handle403(message: string): void; // 403处理
    systemErrorMessage: string; // 全局异常提示消息
    handleConfirm(info: VdConfirmInfo): Promise<any>; // 确认弹框
    handleStartLoading(): void; // 开始执行loading
    handleCloseLoading(): void; // 关闭执行loading
    handleFormValidate($refs: { [key: string]: Vue | Element | Vue[] | Element[] }, formNames: string[]): boolean; // 表单验证
}
