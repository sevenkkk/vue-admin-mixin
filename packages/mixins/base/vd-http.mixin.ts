import { Component, Vue, Watch } from 'vue-property-decorator';
import { UseResult } from '../../model/use-result';
import { vdFetch } from '../../utils/http.utils';
import { VdConfigService } from '../../service/vd-config.service';

@Component
export class VdHttpMixin extends Vue {
	// http请求 loading状态 全局只有一个
	protected vdLoading: boolean = false;

	// 是否需要加载loading状态
	private _isLoading = false;

	@Watch('vdLoading')
	private handleVdLoading(loading: boolean) {
		if (this._isLoading) {
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

	/**
	 * 发送api请求
	 * @param url  请求地址
	 * @param data 请求数据
	 * @param option 选项配置
	 */
	protected async vdFetch<T>(
		url: string,
		data?: any,
		option?: { loading?: boolean },
	): Promise<UseResult<T>> {
		if (option && option.loading != undefined) {
			this._isLoading = option.loading;
		}
		this.vdLoading = true;
		const res = await vdFetch<T>(url, data);
		this.vdLoading = false;
		return res;
	}
}
