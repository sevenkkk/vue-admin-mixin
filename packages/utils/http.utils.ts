import axios from 'axios';
// @ts-ignore
import qs from 'qs';
import { VdConfigService } from '../service/vd-config.service';
import { VdCommonService } from '../service/vd-common.service';
import { UseResult, ResponseBody } from '../model/response-body';
import { vdMessage } from './message.utils';
import { VdRequestOptions } from '../model/request-options';

/**
 * 请求以form表单形式进行提交
 * @param url 请求地址
 * @param data 请求参数，json类型进行转成表单提交格式
 */
const formPost = (url: string, data?: any): Promise<ResponseBody> => {

	if (data && !(VdCommonService.isObject(data) || VdCommonService.isArray(data))) {
		throw new Error('参数值必须为数组和对象!');
	}

	let _data = undefined;

	try {
		if (VdCommonService.isObject(data)) {
			const mapKeys = data.mapKeys || [];
			const map: any = {};
			const other: any = {};
			for (const key in data) {
				// 如果是map的话 以 user.name 这种方式传输
				// @ts-ignore
				if (mapKeys.some(k => k === key)) {
					// @ts-ignore
					map[key] = data[key];
				} else {
					// 对象和数组的haul 以 user[name] user[0].name 的方式传输
					// @ts-ignore
					other[key] = data[key];
				}
			}

			let _map;
			let _other;

			if (Object.keys(map).length !== 0) {
				_map = qs.stringify(map, {skipNulls: true});
			}

			if (Object.keys(other).length !== 0) {
				_other = qs.stringify(other, {allowDots: true, skipNulls: true});
			}

			if (_map) {
				_data = _map;
			}

			if (_other) {
				_data = _data ? `${_data}&${_other}` : _other;
			}
		} else {
			_data = qs.stringify(data, {allowDots: true, skipNulls: true});
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
			if (response.status === 401) {
				errorMessage = VdConfigService.config?.message401 || response.data.errorMessage;
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
 * 发送api请求
 * @param url  请求地址
 * @param data 请求数据
 */
export const vdFetch = <T>(url: string, data?: any): Promise<UseResult<T>> => {
	if (!url) {
		throw new Error('The request URL is not defined.');
	}
	return doFetch(() => formPost(url, data));
};

/**
 * 发送请求api
 * @param url url地址
 * @param data 参数
 * @param options 配置
 */
export const vdRequest = <T>(url: string, data?: any, options?: VdRequestOptions): Promise<UseResult<T>> => {
	if (options) {
		const {message, load} = options;
		let _message = message;
		if (load) {
			_message = {...message, showSuccess: false};
		}
		return vdMessage<T>(() => vdFetch(url, data), _message);
	}

	return vdMessage<T>(() => vdFetch(url, data), !data ? {showSuccess: false} : undefined);
};

/**
 * 上传图片
 * @param url 地址
 * @param file 文件
 * @param obj 附加参数
 */
export const vdUpload = (url: string, file: File, obj?: Object): Promise<UseResult<string>> => {
	let param = new FormData();
	param.append('file', file);

	if (obj) {
		Object.keys(obj).forEach(key => param.append(key, obj[key]));
	}

	let config = {
		headers: {'Content-Type': 'multipart/form-data'},
	};
	return axios.post(url, param, config)
		.then(res => res.data as UseResult<string>);
};

