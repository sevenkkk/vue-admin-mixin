import { Component } from 'vue-property-decorator';
import { VdBaseListMixin } from './base/vd-base-list.mixin';
import { UseResult } from '../model/response-body';

@Component
export class VdListMixin<P, R> extends VdBaseListMixin<P, R> {
	// 二级分类名称
	private subAttr = '';

	// 选择二级分类索引
	public vdSubIndex = 0;

	// 设置二级分类key
	public vdSetSubAttr(attr: string): void {
		this.subAttr = attr;
	}

	// loading 状态
	public get vdLLoading() {
		return this.vdLoading;
	}

	// 获取二级分类对象选中值
	public get vdSubActive() {
		if (!this.subAttr) {
			return undefined;
		}
		return this.vdActive
			? /* eslint-disable */
			// @ts-ignore
			this.vdActive[this.subAttr]
				? /* eslint-disable */
				// @ts-ignore
				this.vdActive[this.subAttr].length > this.vdSubIndex
					? /* eslint-disable */
					// @ts-ignore
					this.vdActive[this.subAttr][this.vdSubIndex]
					: undefined
				: undefined
			: undefined;
	}

	/**
	 * 加载api数据
	 * @param path 地址 请求地址
	 * @param data 请求数据 请求参数
	 */
	public async vdLoadList(path?: string, data?: P): Promise<UseResult<R[]>> {
		this.vdSetListPath(path);
		let _data = this.vdParams;
		if (data) {
			_data = {...this.vdParams, ...data};
		}
		const res = await this.request(this.vdListPath, _data);
		if (this.vdIsDefaultSet) {
			this.vdList = res.payload || [];
		}
		this.vdLoaded = true;
		return res;
	}
}
