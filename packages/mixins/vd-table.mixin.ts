import { Component, Watch } from 'vue-property-decorator';
import { VdBaseListMixin } from './base/vd-base-list.mixin';
import { UseResult } from '../model/response-body';
import { VdMixin } from './base/vd.mixin';
import { EventBus } from '../utils/event-bus.utils';

const VD_PAGE_SYNC_PARAMS_KEY_1 = 'vd-page-sync-params-key-1';
const VD_PAGE_SYNC_PARAMS_KEY_2 = 'vd-page-sync-params-key-2';
const VD_PAGE_SYNC_LIST_KEY_1 = 'vd-page-sync-list-key-1';
const VD_PAGE_SYNC_LIST_KEY_2 = 'vd-page-sync-list-key-2';
const VD_PAGE_LIST_SEARCH_KEY = 'vd-page-list-search-key';

export namespace VdTable {
	/**
	 * 用于表格查询（默认服务端分页）
	 */
	@Component
	export class MainMixin<P, R> extends VdBaseListMixin<P, R> {
		// 数据总条数
		public vdTotal = 0;

		// 当前页
		public vdPage = 1;
		// 每页显示条数
		public vdPageSize = 20;

		// 多选内容
		public vdSelected = [];

		// 是否使用分页
		public vdUsePage(): boolean {
			return true;
		}

		@Watch('vdParams', {deep: true})
		private vdUpdateParams(params: P) {
			EventBus.$emit(VD_PAGE_SYNC_PARAMS_KEY_1, params);
		}

		@Watch('vdList', {deep: true})
		private vdUpdateList(list: Array<R>) {
			EventBus.$emit(VD_PAGE_SYNC_LIST_KEY_1, list);
		}

		/**
		 * 初始化
		 */
		protected beforeCreate() {
			EventBus.$on(VD_PAGE_SYNC_PARAMS_KEY_2, (params: P) => this.vdParams = params);
			EventBus.$on(VD_PAGE_SYNC_LIST_KEY_2, (list: Array<R>) => this.vdList = list);
			EventBus.$on(VD_PAGE_LIST_SEARCH_KEY, (type: number) => {
				if (type == 0) {
					this.vdInitData().then();
				} else {
					this.vdRefresh().then();
				}
			});
		}

		/**
		 * 初始化
		 */
		protected created() {
			// 设置初始值
			this.vdParams = this.vdDefaultParams();
		}

		protected beforeDestroy() {
			EventBus.$off(VD_PAGE_SYNC_PARAMS_KEY_2);
			EventBus.$off(VD_PAGE_SYNC_LIST_KEY_2);
			EventBus.$off(VD_PAGE_LIST_SEARCH_KEY);
		}

		/**
		 * 初始化数据
		 * @param path
		 * @param data
		 */
		protected vdInitData(path?: string, data?: P): Promise<UseResult<R[]>> {
			this.vdSetListPath(path);
			if (this.vdUsePage()) {
				this.vdPage = 1;
			}
			return this.vdRefresh(data);
		}

		/**
		 * 加载api数据
		 * @param data 参数
		 */
		public async vdRefresh(data?: P): Promise<UseResult<R[]>> {
			let _data = {
				...this.vdParams,
				page: this.vdUsePage() ? this.vdPage : undefined,
				pageSize: this.vdUsePage() ? this.vdPageSize : undefined,
			};
			if (data) {
				_data = {..._data, ...data};
			}
			const res = await this.request(this.vdListPath, _data);
			if (this.vdIsDefaultSet) {
				this.vdList = res.payload || [];
				if (this.vdUsePage()) {
					this.vdTotal = res.totalCount || 0;
				}
			}
			this.vdLoaded = true;
			return res;
		}

		/**
		 * 根据分页变化重新加载数据
		 * @param data 分页配置
		 */
		public vdRefreshByPage(data: { page?: number; pageSize?: number }) {
			if (this.vdUsePage()) {
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
	}

	/**
	 * 检索条件作为单独组件时，可以使用。
	 */
	@Component
	export class ParamMixin<T> extends VdMixin {

		// 参数
		public vdParams = {} as any;

		@Watch('vdParams', {deep: true})
		private vdUpdateParams(params: T) {
			EventBus.$emit(VD_PAGE_SYNC_PARAMS_KEY_2, params);
		}

		public beforeCreate() {
			EventBus.$on(VD_PAGE_SYNC_PARAMS_KEY_1, (params: T) => this.vdParams = params);
		}

		protected beforeDestroy() {
			EventBus.$off(VD_PAGE_SYNC_PARAMS_KEY_1);
		}

		/**
		 * 查询数据
		 */
		public vdSearch() {
			EventBus.$emit(VD_PAGE_LIST_SEARCH_KEY, 0);
		}

		/**
		 * 刷新数据列表
		 */
		public vdRefresh() {
			EventBus.$emit(VD_PAGE_LIST_SEARCH_KEY, 1);
		}

		/**
		 * 清空对象
		 */
		public vdClear() {
			this.vdParams = {} as any;
		}
	}

	@Component
	export class ListMixin<T> extends VdMixin {
		public vdList: Array<T> = [];

		@Watch('vdList', {deep: true})
		private vdUpdateList(list: Array<T>) {
			EventBus.$emit(VD_PAGE_SYNC_LIST_KEY_2, list);
		}

		protected beforeCreate() {
			EventBus.$on(VD_PAGE_SYNC_LIST_KEY_1, (list: Array<T>) => this.vdList = list);
		}

		protected beforeDestroy() {
			EventBus.$off(VD_PAGE_SYNC_LIST_KEY_1);
		}

		/**
		 * 刷新数据列表
		 */
		public vdRefresh() {
			EventBus.$emit(VD_PAGE_LIST_SEARCH_KEY, 1);
		}

		/**
		 * 查询数据
		 */
		public vdSearch() {
			EventBus.$emit(VD_PAGE_LIST_SEARCH_KEY, 0);
		}
	}
}
