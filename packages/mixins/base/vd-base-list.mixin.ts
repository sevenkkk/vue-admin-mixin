import { Component } from 'vue-property-decorator';
import { VcMixin } from './vc.mixin';
import { UseResult } from '../../model/response-body';

// @ts-ignore
@Component
export abstract class VcBaseListMixin<P, R> extends VcMixin {
	// 是否直接赋值
	protected vcIsDefaultSet = true;

	// 返回值列表
	public vcList: R[] = [];

	// 请求参数
	public vcParams: P = {} as any;

	// 当前索引
	public vcIndex: number = 0;

	// 请求地址
	protected vcListPath!: string;

	// 是否已经加载
	protected vcIsLoaded: boolean = false;

	// 当前选中的对象
	protected get vcActive(): R | undefined {
		return this.vcList.length > this.vcIndex ? this.vcList[this.vcIndex] : undefined;
	}

	// 无数据
	public get vcEmpty(): boolean {
		return this.vcList.length == 0 && this.vcIsLoaded;
	}

	// 是否有数据
	protected get vcHasData() {
		return this.vcList && this.vcList.length > 0;
	}

	/**
	 * 请求列表数据
	 */
	protected async request(path: string, data: any): Promise<UseResult<R[]>> {
		return await this.vcRequest<R[]>(path, data, {load: true});
	}

	/**
	 * 设置默认参数
	 */
	protected defaultParams(): P {
		return {} as any;
	}

	/**
	 * 初始化
	 */
	protected created() {
		// 设置初始值
		this.vcParams = this.defaultParams();
	}

	/**
	 * 设置请求参数
	 * @param path
	 */
	protected vcSetListPath(path?: string) {
		if (path) {
			this.vcListPath = path;
		}
		if (!this.vcListPath) {
			throw new Error('首次必须传入path');
		}
	}
}
