import { Component, Vue } from 'vue-property-decorator';
import { VdRespObjMixin } from './base/vd-resp-obj-mixin';
import { UseResult } from '../model/response-body';
import { VdCommonService } from '../service/vd-common.service';
import { VdConfigService } from '../service/vd-config.service';

@Component
export class VdSubmitMixin<T, R> extends VdRespObjMixin<T> {

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
	public async vdSubmit(path: string, data?: T, options: { merge: boolean } = {merge: true}): Promise<UseResult<R>> {
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
	 * 表单验证
	 * @param $refs refs
	 * @param formName form对象ref
	 * @param success 成功回调
	 * @param err 失败回调
	 */
	protected vdValidate($refs: { [key: string]: Vue | Element | Vue[] | Element[] }, formName: string | string[], success: () => void, err?: () => void) {
		if (!formName) {
			throw new Error('必须指定formName');
		}
		let formNames: string[] = [];
		if (VdCommonService.isString(formName)) {
			formNames = [formName as string];
		} else {
			formNames = formName as string[];
		}
		const result = VdConfigService.config.handleFormValidate($refs, formNames);

		if (!result) {
			success();
		} else {
			if (err) {
				err();
			}
		}
	}
}
