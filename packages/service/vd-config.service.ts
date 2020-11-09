import { Vue } from 'vue-property-decorator';

/**
 * 提示消息
 */
export interface VdConfirmInfo {
	title: string; // 标题
	content: string; // 内容
}

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

/**
 * 默认配置实现，继承重写对象方法
 */
export class VdDefaultConfigService extends Vue implements VdConfigOptions {

	message401 = '登录已过期，请重新登录!';
	message403 = '您没有权限！';
	showMessage401 = true;
	showMessage403 = true;
	systemErrorMessage = '系统异常,请联系管理员！';

	/**
	 * 处理401
	 * @param message
	 */
	handle401(message: string): void {
	}

	/**
	 * 处理403
	 * @param message
	 */
	handle403(message: string): void {
	}

	/**
	 * 处理确认框
	 * @param info 确认框
	 */
	handleConfirm(info: VdConfirmInfo): Promise<any> {
		return new Promise((resolve, reject) => {
			if (confirm(info.content) == true) {
				resolve(info);
			} else {
				reject();
			}
		});
	}

	/**
	 * 提示失败信息
	 * @param message
	 */
	showErrorMessage(message: string): void {
		alert(message);
	}

	/**
	 * 提示成功信息
	 * @param message
	 */
	showSuccessMessage(message: string): void {
		alert(message);
	}

	/**
	 * 开始loading加载
	 */
	handleStartLoading(): void {
	}

	/**
	 * 结束加载loading
	 */
	handleCloseLoading(): void {
	}

	/**
	 * 处理表单验证
	 * @param $refs refs
	 * @param formNames 表单组件ref名
	 */
	handleFormValidate($refs: { [key: string]: Vue | Element | Vue[] | Element[] }, formNames: string[]) {
		return true;
	}
}

/**
 * 全局配置服务
 */
export class VdConfigService {
	static config: VdConfigOptions = new VdDefaultConfigService();

	static setUp(config?: VdConfigOptions) {
		if (config) {
			this.config = config;
		}
	}
}
