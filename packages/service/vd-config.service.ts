import { VdConfigOptions } from '../model/config-options';

/**
 * 全局配置服务
 */
export class VdConfigService {
	// 全局配置
	static config: VdConfigOptions = {
		message401: '登录已过期，请重新登录!',
		message403: '您没有权限!',
		systemErrorMessage: '系统异常,请联系管理员!',
		showMessage401: true,
		showMessage403: true,
		showErrorMessage: (message: string) => {
			alert(message);
		},
		showSuccessMessage: (message: string) => {
			alert(message);
		},
	};

	/**
	 * 设置全局配置
	 * @param config 配置
	 */
	static setup(config?: VdConfigOptions): void {
		if (config) {
			this.config = {...this.config, ...config};
		}
	}
}
