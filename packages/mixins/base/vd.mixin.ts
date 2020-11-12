import { Component } from 'vue-property-decorator';
import { UseResult } from '../../model/response-body';
import { VdConfigService, VdConfirmInfo } from '../../service/vd-config.service';
import { VdRequestOptions, vdRequest } from '../../utils/http.utils';
import { VdHttpMixin } from './vd-http.mixin';

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
		return vdRequest<T>(url, data, options);
	}
}
