import { UseResult } from '../model/response-body';
import { VdCommonService } from '../service/vd-common.service';
import { VdConfigService } from '../service/vd-config.service';

/**
 * 消息提示配置选项
 */
export interface VdMessageOptions {
	showMessage?: boolean; // 是否显示消息
	successMessage?: string; // 成功消息内容
	errorMessage?: string; // 错误消息内容
	showError?: boolean; // 是否显示错误消息
	showSuccess?: boolean; // 是否显示成功消息
}

let timeout: any = null;

/**
 * 请求处理消息信息
 * @param fetch 请求体
 * @param options 处理消息配置
 */
export const vdMessage = async <T>(fetch: () => Promise<UseResult<T>>,
								   options?: VdMessageOptions): Promise<UseResult<T>> => {
	const result = await fetch();
	const {success, payload, errorCode, errorMessage: _errorMessage} = result;
	const {
		showMessage,
		successMessage,
		errorMessage,
		showError,
		showSuccess,
	} = {
		showMessage: true,
		showError: true,
		showSuccess: true,
		...options,
	};
	if (success) {
		if (showMessage && showSuccess) {
			if (!VdCommonService.isString(payload) && !successMessage) {
				throw new Error(
					'Api返回值 「payload」字段的类型不是字符串，请设置options=> showSuccess: false，来取消自动提示成功消息',
				);
			}
			const _successMessage = successMessage
				? successMessage
				: String(payload) || '操作成功！';
			setTimeout(() => {
				VdConfigService.config.showSuccessMessage(_successMessage);
			});
		}
		return result;
	} else {
		const __errorMessage = errorMessage
			? errorMessage
			: _errorMessage || VdConfigService.config?.systemErrorMessage;
		if (showMessage && showError) {
			if (errorCode == '403') {
				if (timeout != null) {
					clearTimeout(timeout);
				}

				timeout = setTimeout(function () {
					if (VdConfigService.config?.showMessage403) {
						VdConfigService.config.showErrorMessage(__errorMessage);
					}
					VdConfigService.config.handle403(__errorMessage);
				}, 500);
			} else {
				setTimeout(() => {
					VdConfigService.config.showErrorMessage(__errorMessage);
				});
			}
		}
		throw result;
	}
};
