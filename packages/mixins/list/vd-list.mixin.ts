import { Component } from 'vue-property-decorator';
import { VdBaseListMixin } from '../base/vd-base-list.mixin';
import { UseResult } from '../../model/use-result';

@Component
export class VdListMixin<P, R> extends VdBaseListMixin<P, R> {

	/**
	 * 加载api数据
	 * @param path 地址 请求地址
	 * @param data 请求数据 请求参数
	 */
	public async vdLoadList(path?: string, data?: P): Promise<UseResult<R[]>> {
		this.vdSetListPath(path);
		try {
			let _data = this.vdParams;
			if (data) {
				_data = {...this.vdParams, ...data};
			}
			const res = await this.request(this.vdListPath, _data);
			if (this.vdIsDefaultSet) {
				this.vdList = res.payload || [];
			}
			this.vdLoadSuccess(res.payload);
			this.vdLoaded = true;
			return res;
		} catch (err) {
			this.vdLoadError(err);
			throw err;
		}
	}

	/**
	 * 加载成功回调
	 * @param result 结果
	 */
	protected vdLoadSuccess(result?: R[]) {
	}

	/**
	 * 加载失败回调
	 * @param err 错误
	 */
	protected vdLoadError(err?: any) {
	}
}
