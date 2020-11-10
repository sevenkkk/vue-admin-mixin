import { Component } from 'vue-property-decorator';
import { VdRespObjMixin } from './base/vd-resp-obj-mixin';
import { UseResult } from '../model/response-body';

@Component
export class VdObjMixin<T> extends VdRespObjMixin<T> {
	// 请求地址
	private loadPath!: string;

	// 是否已经加载
	private isLoaded = false;

	// 无数据
	public get vdOEmpty() {
		return (this.vdData ? Object.keys(this.vdData).length == 0 : true) && this.isLoaded;
	}

	// 是否有数据
	public get vdOHasData() {
		return !(this.vdData ? Object.keys(this.vdData).length == 0 : true);
	}

	// loading 状态
	public get vdOLoading() {
		return this.vdLoading;
	}

	/**
	 * 加载数据
	 * @param path 请求路径
	 * @param params 请求参数
	 */
	protected async vdLoadData(path?: string, params?: any) {
		this.vdSetLoadPath(path);
		try {
			const res = await this.vdLoadRequest(this.loadPath, params);
			this.vdData = res.payload as T;
			this.isLoaded = true;
			this.vdLoadSuccess(res.payload);
			return res;
		} catch (err) {
			this.vdLoadError(err);
			throw err;
		}
	}

	/**
	 * 加载数据对象
	 * @param path 请求参数
	 * @param params 参数
	 */
	private vdLoadRequest(path: string, params?: any): Promise<UseResult<T>> {
		return this.vdRequest<T>(path, params, {load: true});
	}

	/**
	 * 加载成功回调
	 * @param result 结果
	 */
	protected vdLoadSuccess(result?: T) {
	}

	/**
	 * 加载失败回调
	 * @param err 错误
	 */
	protected vdLoadError(err?: any) {
	}


	/**
	 * 设置保存请求路径
	 * @param path
	 */
	private vdSetLoadPath(path?: string) {
		if (path) {
			this.loadPath = path;
		}
		if (!this.loadPath) {
			throw new Error('首次必须传入path');
		}
	}
}
