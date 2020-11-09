import { Component } from 'vue-property-decorator';
import { vdRespObjMixin } from './base/vd-resp-obj-mixin';
import { UseResult } from '../model/response-body';
import { CommonService } from '../service/common.service';
import { ConfigService } from '../service/config.service';

@Component
export class vdSubmitMixin<T, R> extends vdRespObjMixin<T> {

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
	 * @param formName form对象ref
	 * @param success 成功回调
	 * @param err 失败回调
	 */
	public vdValidate(formName: string | string[], success: () => void, err?: () => void) {
		let formNames: string[] = [];
		if (CommonService.isString(formName)) {
			formNames = [formName as string];
		} else {
			formNames = formName as string[];
		}
		let _result = false;
		try {
			/* eslint-disable */
			// @ts-ignore
			if (this.$refs[formName] && this.$refs[formName]?.validate) {
				formNames.forEach(formName => {
					/* eslint-disable */
					// @ts-ignore
					this.$refs[formName].validate((result, item) => {
						if (!result) {
							for (let key in item) {
								setTimeout(() => ConfigService.showErrorMessage(item[key][0].message), 1);
							}
							_result = true;
						}
					});
				});
			}
		} catch (e) {
			console.log(e);
		}
		if (!_result) {
			success();
		} else {
			if (err) {
				err();
			}
		}
	}
}
