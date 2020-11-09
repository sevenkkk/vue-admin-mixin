import { Component } from 'vue-property-decorator';
import { VdBaseListMixin } from './base/vd-base-list.mixin';
import { UseResult } from '../model/response-body';

namespace Page
@Component
export class VdListPageMixin<P, R> extends VdBaseListMixin<P, R> {
	// 总页码数
	public vdTotal = 0;

	// 当前页
	public vdPage = 1;
	// 每页显示条数
	public vdPageSize = 20;

	// 多选内容
	public vdSelected: R[] = [];

	/**
	 * loading数据
	 */
	public get vdPageLoading() {
		return this.vdLoading;
	}

	/**
	 * 初始化数据
	 * @param path
	 * @param data
	 */
	protected vdInitData(path?: string, data?: P): Promise<UseResult<R[]>> {
		this.vdSetListPath(path);
		this.vdPage = 1;
		return this.vdRefresh(data);
	}

	/**
	 * 加载api数据
	 * @param data 参数
	 */
	public async vdRefresh(data?: P): Promise<UseResult<R[]>> {
		let _data = {...this.vdParams, page: this.vdPage, pageSize: this.vdPageSize};
		if (data) {
			_data = {..._data, ...data};
		}
		const res = await this.request(this.vdListPath, _data);
		if (this.vdIsDefaultSet) {
			this.vdList = res.payload || [];
			this.vdTotal = res.totalCount || 0;
		}
		this.vdIsLoaded = true;
		return res;
	}

	/**
	 * 根据分页变化重新加载数据
	 * @param data 分页配置
	 */
	public vdRefreshByPage(data: { page?: number; pageSize?: number }) {
		const {page: _page, pageSize: _pageSize} = data;
		if (_page) {
			this.vdPage = _page;
		}
		if (_pageSize) {
			this.vdPageSize = _pageSize;
		}

		this.vdRefresh().then();
	}

}
