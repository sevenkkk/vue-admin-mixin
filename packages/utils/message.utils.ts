import { UseResult } from '../model/use-result';
import { VdCommonService } from '../service/vd-common.service';
import { VdConfigService } from '../service/vd-config.service';
import { VdMessageOptions } from '../model/request-options';

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
					'Api返回值 「payload」字段的类型不是字符串，请设置options=> showSuccess: false、' +
					'或者设置load:true,来取消自动提示成功消息',
				);
			}
			const _successMessage = successMessage
				? successMessage
				: String(payload) || '操作成功！';
			setTimeout(() => {
				VdConfigService.config?.showSuccessMessage(_successMessage);
			});
		}
		return result;
	} else {
		const __errorMessage = errorMessage
			? errorMessage
			: _errorMessage || VdConfigService.config?.systemErrorMessage;
		if (showMessage && showError) {
			if (timeout != null) {
				clearTimeout(timeout);
			}
			if (errorCode == '403') {
				timeout = setTimeout(() => {
					if (VdConfigService.config?.showMessage403) {
						VdConfigService.config?.showErrorMessage(__errorMessage);
					}
					if (VdConfigService.config?.handle403) {
						VdConfigService.config.handle403(__errorMessage);
					}
				}, 500);
			} else if (errorCode == '401') {
				timeout = setTimeout(() => {
					if (VdConfigService.config?.showMessage401) {
						VdConfigService.config?.showErrorMessage(__errorMessage);
					}
					if (VdConfigService.config?.handle401) {
						VdConfigService.config?.handle401(__errorMessage);
					}
				}, 500);
			} else {
				timeout = setTimeout(() => {
					VdConfigService.config?.showErrorMessage(__errorMessage);
				}, 500);
			}
		}
		throw result;
	}
};
