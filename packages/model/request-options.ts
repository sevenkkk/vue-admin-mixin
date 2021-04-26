/**
 * 请求配置选项
 */
export interface VdRequestOptions {
	load?: boolean; // 是否是获取请求
	loading?: boolean; // 是否加载loading框
	loadingType?: VdLoadingType; // 加载loading框类型
	message?: VdMessageOptions; // 处理message选项
	confirm?: VdConfirmInfo; // 确认提示消息
}

export enum VdLoadingType {
	STATUS_ONLY, // 状态改变
	ALERT // 转圈圈
}

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

/**
 * 提示消息
 */
export interface VdConfirmInfo {
	title: string; // 标题
	content: string; // 内容
	options?: any; // 配置
}
