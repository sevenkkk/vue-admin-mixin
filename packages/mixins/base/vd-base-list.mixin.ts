import { Component } from 'vue-property-decorator';
import { VdMixin } from './vd.mixin';
import { UseResult } from '../../model/response-body';

// @ts-ignore
@Component
export abstract class VdBaseListMixin<P, R> extends VdMixin {
	// 是否直接赋值
	protected vdIsDefaultSet = true;

	// 返回值列表
	public vdList: R[] = [];

	// 请求参数
	protected vdParams: P = {} as any;

	// 当前索引
	public vdIndex = 0;

	// 请求地址
	protected vdListPath!: string;

	// 是否已经加载
	protected vdLoaded = false;

	// 当前选中的对象
	protected get vdActive(): R | undefined {
		return this.vdList.length > this.vdIndex ? this.vdList[this.vdIndex] : undefined;
	}

	// 无数据
	public get vdLEmpty(): boolean {
		return this.vdList.length == 0 && this.vdLoaded;
	}

	/**
	 * 请求列表数据
	 */
	protected async request(path: string, data: any): Promise<UseResult<R[]>> {
		return await this.vdRequest<R[]>(path, data, {load: true});
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
	protected vdSetListPath(path?: string) {
		if (path) {
			this.vdListPath = path;
		}
		if (!this.vdListPath) {
			throw new Error('首次必须传入path');
		}
	}
}
