import { Component, Vue } from 'vue-property-decorator';
import { UseResult } from '../../model/use-result';
import { vdFetch } from '../../utils/http.utils';
import { VdConfigService } from '../../service/vd-config.service';
import { VdLoadingType } from '../..';

@Component
export class VdHttpMixin extends Vue {
	// http请求 loading状态 全局只有一个
	protected vdLoading: boolean = false;

	/**
	 * 发送api请求
	 * @param url  请求地址
	 * @param data 请求数据
	 * @param option 选项配置
	 */
	protected async vdFetch<T>(
		url: string,
		data?: any,
		option?: { loading?: boolean, loadingType?: VdLoadingType },
	): Promise<UseResult<T>> {

		this.handleVdLoading(true, option);

		const res = await vdFetch<T>(url, data);

		this.handleVdLoading(false, option);

		return res;
	}

	private handleVdLoading(result: boolean, option?: { loading?: boolean, loadingType?: VdLoadingType }) {
		const {loading, loadingType} = option || {};
		if (loading) {
			if (loadingType == VdLoadingType.STATUS_ONLY) {
				this.vdLoading = result;
			} else if (loadingType == VdLoadingType.ALERT) {
				this.handleAlertLoading(result);
			}
		}
	}

	// 处理alert 加载状态
	private handleAlertLoading(loading: boolean) {
		if (loading) {
			if (VdConfigService.config?.handleStartLoading) {
				VdConfigService.config?.handleStartLoading();
			}
		} else {
			if (VdConfigService.config?.handleCloseLoading) {
				VdConfigService.config?.handleCloseLoading();
			}
		}
	}
}
