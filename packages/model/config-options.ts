import { VdConfirmInfo } from './request-options';
import { UseResult } from './use-result';

export interface VdConfigOptions {
	message401?: string; //提示401消息
	message403?: string; //提示403消息
	showMessage401?: boolean; // 是否显示401消息
	showMessage403?: boolean; // 是否显示403消息
	systemErrorMessage?: string; // 全局异常提示消息
	showErrorMessage: (message: string) => void; // 失败提示消息
	showSuccessMessage: (message: string) => void; // 成功提示消息
	handle401?: (message: string) => void; // 401处理
	handle403?: (message: string) => void; // 403处理
	handleConfirm?: (info: VdConfirmInfo) => Promise<any>; // 确认弹框
	handleStartLoading?: () => void; // 开始执行loading
	handleCloseLoading?: () => void;// 关闭执行loading
	handleFormValidate?: ($refs: any, formNames: string[]) => boolean // 表单验证
	handleHttpResult?: <T>(resBody: any) => UseResult<T>;  // 处理正常请求返回值
}
