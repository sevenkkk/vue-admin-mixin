import { Component } from 'vue-property-decorator';
import { VdMixin } from './vd.mixin';
import { UseResult } from '../../model/use-result';
import { VdLoadingType, VdRequestOptions } from '../..';

// @ts-ignore
@Component
export abstract class VdBaseListMixin<P, R> extends VdMixin {
	// 是否直接赋值
	protected vdIsDefaultSet = true;

	// 返回值列表
	public vdList: R[] = [];

	// 请求参数
	protected vdParams: P = {} as any;

	// 请求地址
	protected vdListPath!: string;

	// 是否已经加载
	protected vdLoaded = false;

	// loading 状态
	public get vdLLoading() {
		return this.vdLoading;
	}

	// 无数据
	public get vdLEmpty(): boolean {
		return this.vdList.length == 0 && this.vdLoaded;
	}

	// 是否有数据
	protected get vdLHasData() {
		return this.vdList && this.vdList.length > 0;
	}

	/**
	 * 请求列表数据
	 */
	protected async request(path: string, data: any, options: VdRequestOptions = {
		load: true,
		loading: true,
		loadingType: VdLoadingType.STATUS_ONLY,
	}): Promise<UseResult<R[]>> {
		return await this.vdRequest<R[]>(path, data, options);
	}

	/**
	 * 设置默认参数
	 */
	protected vdDefaultParams(): P {
		return {} as any;
	}

	/**
	 * 设置请求参数
	 * @param path
	 */
	public vdSetListPath(path?: string) {
		if (path) {
			this.vdListPath = path;
		}
		if (!this.vdListPath) {
			throw new Error('首次必须传入path');
		}
	}
}
