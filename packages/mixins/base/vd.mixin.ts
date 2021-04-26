import { Component } from 'vue-property-decorator';
import { UseResult } from '../../model/use-result';
import { VdConfigService } from '../../service/vd-config.service';
import { VdHttpMixin } from './vd-http.mixin';
import { vdMessage } from '../../utils/message.utils';
import { VdRequestOptions, VdConfirmInfo } from '../../model/request-options';

@Component
export class VdMixin extends VdHttpMixin {

	/**
	 * 确认提示
	 * @param info 消息
	 */
	protected vdConfirm<T>(info: VdConfirmInfo): Promise<any> {
		if (VdConfigService.config.handleConfirm) {
			return VdConfigService.config.handleConfirm(info);
		}
		return new Promise(res => res(null));
	}

	/**
	 * 发送请求api，实际上是vdConfirm、vdMessage的组合使用
	 * @param url url地址
	 * @param data 参数
	 * @param options 配置
	 */
	protected vdRequest<T>(url: string, data?: any, options?: VdRequestOptions): Promise<UseResult<T>> {
		if (options) {
			const {message, confirm, load, loading, loadingType} = options;
			let _message = message;
			if (load) {
				_message = {...message, showSuccess: false};
			}
			if (confirm && VdConfigService.config?.handleConfirm) {
				return VdConfigService.config?.handleConfirm(confirm).then(() => {
					return vdMessage<T>(() => this.vdFetch(url, data, {loading, loadingType}), _message);
				});
			}
			return vdMessage<T>(() => this.vdFetch(url, data, {loading, loadingType}), _message);
		}
		return vdMessage<T>(() => this.vdFetch(url, data));
	}
}
