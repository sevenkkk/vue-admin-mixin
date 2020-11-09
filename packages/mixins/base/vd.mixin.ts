import { Component } from 'vue-property-decorator';
import { UseResult } from '../../model/response-body';
import { vdMessage, VdMessageOptions } from '../../utils/message.utils';
import { VdConfigService, VdConfirmInfo } from '../../service/vd-config.service';
import { vdFetch } from '../../utils/http.utils';
import { VdHttpMixin } from './vd-http.mixin';

/**
 * 请求配置选项
 */
export interface VdRequestOptions {
	load?: boolean; // 是否是获取请求
	loading?: boolean; // 是否加载loading框
	message?: VdMessageOptions; // 处理message选项
	confirm?: VdConfirmInfo; // 确认提示消息
}

@Component
export class VdMixin extends VdHttpMixin {

	/**
	 * 确认提示
	 * @param info 消息
	 */
	protected vdConfirm<T>(info: VdConfirmInfo): Promise<UseResult<T>> {
		return VdConfigService.config.handleConfirm(info);
	}

	/**
	 * 发送请求api，实际上是vdConfirm、vdMessage的组合使用
	 * @param url url地址
	 * @param data 参数
	 * @param options 配置
	 */
	protected vdRequest<T>(url: string, data?: any, options?: VdRequestOptions): Promise<UseResult<T>> {
		if (options) {
			const {message, confirm, load, loading} = options;
			let _message = message;
			if (load) {
				_message = {...message, showSuccess: false};
			}
			if (confirm) {
				return this.vdConfirm(confirm).then(() => {
					return vdMessage<T>(() => this.vdFetch(url, data, {loading}), _message);
				});
			}
			return vdMessage<T>(() => this.vdFetch(url, data, {loading}), _message);
		}
		return vdMessage<T>(() => vdFetch(url, data));
	}
}
