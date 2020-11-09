import axios from 'axios';
// @ts-ignore
import qs from 'qs';
import { VdConfigService } from '../service/vd-config.service';
import { VdCommonService } from '../service/vd-common.service';
import { UseResult, ResponseBody } from '../model/response-body';

/**
 * 发送api请求
 * @param url  请求地址
 * @param data 请求数据
 */
export const vdFetch = <T>(url: string, data?: Array<Object> | Object): Promise<UseResult<T>> => {
	if (!url) {
		throw new Error('请求url未定义。');
	}
	return doFetch(() => formPost(url, data));
};

/**
 * 发送请求，处理返回值
 * @param doRequest 请求体
 */
const doFetch = async <T>(doRequest: () => Promise<ResponseBody>): Promise<UseResult<T>> => {
	try {
		const {success, count, payload, errorMessage} = await doRequest();
		return {success, payload, errorMessage, totalCount: count};
	} catch (err) {
		let errorMessage;
		let errorCode;
		const response = err.response;
		if (response) {
			if (response.status === 400) {
				errorMessage = response.data.errorMessage || '';
			}
			if (response.status === 403) {
				errorMessage = VdConfigService.config?.message403 || response.data.errorMessage;
			}
			errorCode = response.data.errorCode;
			errorMessage = response.data.errorMessage || VdConfigService.config?.systemErrorMessage;
		}
		/* eslint-disable */
		// @ts-ignore
		return {success: false, errorCode: errorCode || '500', errorMessage: errorMessage};
	}
};

/**
 * 请求以form表单形式进行提交
 * @param url 请求地址
 * @param data 请求参数，json类型进行转成表单提交格式
 */
const formPost = (url: string, data?: Array<any> | Object): Promise<ResponseBody> => {

	if (data && !(VdCommonService.isObject(data) || VdCommonService.isArray(data))) {
		throw new Error('参数值必须为数组和对象!');
	}

	let _data = undefined;

	try {
		if (data) {
			if (data && VdCommonService.isObject(data)) {
				const target: any = {};
				const other: any = {};
				for (const key in data) {
					// @ts-ignore
					if (VdCommonService.isArray(data[key])) {
						// @ts-ignore
						target[key] = data[key];
					} else {
						// @ts-ignore
						other[key] = data[key];
					}
				}

				let _target;
				let _other;

				if (Object.keys(target).length !== 0) {
					_target = qs.stringify(target, {allowDots: true, skipNulls: true});
				}

				if (Object.keys(other).length !== 0) {
					_other = qs.stringify(other, {skipNulls: true});
				}

				if (_target) {
					_data = _target;
				}

				if (_other) {
					_data = _data ? `${_data}&${_other}` : _other;
				}
			} else {
				_data = qs.stringify(data, {allowDots: true, skipNulls: true});
			}
		}
	} catch (e) {
		console.log(e);
	}

	return axios({
		baseURL: url,
		method: 'post',
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		data: _data,
	}).then(res => res.data);
};
