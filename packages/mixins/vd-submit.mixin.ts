import { Component } from 'vue-property-decorator';
import { VdRespObjMixin } from './base/vd-resp-obj-mixin';
import { UseResult } from '../model/response-body';
import { vdValidate } from '../utils/validate.utils';

// @ts-ignore
@Component
abstract class BaseSubmitMixin<T, R> extends VdRespObjMixin<T> {

	// 是否正在加载
	public get vdSLoading() {
		return this.vdLoading;
	}

	/**
	 * 提交表单
	 * @param path 请求地址
	 * @param data 请求数据
	 * @param options 参数问题
	 */
	public async vdSubmit(path: string, data?: T, options: { merge: boolean } = {merge: false}): Promise<UseResult<R>> {
		let _data = this.vdData;
		if (data) {
			if (options?.merge) {
				_data = {..._data, ...data};
			} else {
				_data = data;
			}
		}
		try {
			const res = await this.vdSubmitRequest(path, _data);
			this.vdSubmitSuccess(res.payload);
			return res;
		} catch (err) {
			this.vdSubmitError(err);
			throw err;
		}
	}

	/**
	 * 提交请求定义
	 * @param path 请求地址
	 * @param data 请求数据
	 */
	private vdSubmitRequest(path: string, data: T): Promise<UseResult<R>> {
		return this.vdRequest<R>(path, data, {loading: true});
	}

	/**
	 * 提交成功回调
	 * @param result 结果
	 */
	protected vdSubmitSuccess(result?: R) {
	}

	/**
	 * 提交失败回调
	 * @param err 错误
	 */
	protected vdSubmitError(err: any) {
	}

	/**
	 * 提交
	 */
	public abstract vdHandleSubmit(): void;

	/**
	 * 用于表单验证
	 * @param formName ref名称
	 * @param success 成功回调
	 * @param err 错误回调
	 */
	protected vdValidate(formName: string | string[], success: () => void, err?: () => void) {
		vdValidate(this.$refs, formName, success, err);
	}
}

/**
 * 用于表单提交
 */
@Component
// @ts-ignore
export class VdSubmitMixin<T, R> extends BaseSubmitMixin<T, R> {
}
