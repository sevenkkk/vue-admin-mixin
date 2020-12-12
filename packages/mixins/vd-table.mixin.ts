import { Component, Watch } from 'vue-property-decorator';
import { VdBaseListMixin } from './base/vd-base-list.mixin';
import { UseResult } from '../model/use-result';
import { VdMixin } from './base/vd.mixin';
import { EventBus } from '../utils/event-bus.utils';
import { findComponentByAttrName } from '../utils/vue-component.utils';

const VD_PAGE_SYNC_PARAMS_KEY_1 = 'vd-page-sync-params-key-1';
const VD_PAGE_SYNC_PARAMS_KEY_2 = 'vd-page-sync-params-key-2';
const VD_PAGE_SYNC_LIST_KEY_1 = 'vd-page-sync-list-key-1';
const VD_PAGE_SYNC_LIST_KEY_2 = 'vd-page-sync-list-key-2';
const VD_PAGE_SYNC_SELECTED_KEY_1 = 'vd-page-sync-select-key-1';
const VD_PAGE_SYNC_SELECTED_KEY_2 = 'vd-page-sync-select-key-2';
const VD_PAGE_LIST_SEARCH_KEY = 'vd-page-list-search-key';

export namespace VdTable {
	/**
	 * 用于表格查询（默认服务端分页）
	 */
	@Component
	export class MainMixin<P, R> extends VdBaseListMixin<P, R> {

		private get vdKey() {
			// @ts-ignore
			return this?._uid;
		}

		public vdTableMainMixin = true;

		// 数据总条数
		public vdTotal = 0;

		// 当前页
		public vdPage = 1;

		// 每页显示条数
		public vdPageSize = 20;

		// 多选内容
		public vdSelected = [];


		public vdOldParams = {};

		// 是否使用分页
		public vdUsePage(): boolean {
			return true;
		}

		@Watch('vdParams', {deep: true})
		private vdUpdateParams(params: P) {
			EventBus.$emit(`${VD_PAGE_SYNC_PARAMS_KEY_1}-${this.vdKey}`, params);
		}

		@Watch('vdList', {deep: true})
		private vdUpdateList(list: Array<R>) {
			EventBus.$emit(`${VD_PAGE_SYNC_LIST_KEY_1}-${this.vdKey}`, list);
		}

		@Watch('vdSelected', {deep: true})
		private vdUpdateSelected(list: Array<R>) {
			EventBus.$emit(`${VD_PAGE_SYNC_SELECTED_KEY_1}-${this.vdKey}`, list);
		}

		/**
		 * 初始化
		 */
		protected created() {
			EventBus.$on(`${VD_PAGE_SYNC_PARAMS_KEY_2}-${this.vdKey}`, (params: P) => this.vdParams = params);
			EventBus.$on(`${VD_PAGE_SYNC_LIST_KEY_2}-${this.vdKey}`, (list: Array<R>) => this.vdList = list);
			EventBus.$on(`${VD_PAGE_SYNC_SELECTED_KEY_2}-${this.vdKey}`, (list: Array<R>) => this.vdSelected = list);
			EventBus.$on(`${VD_PAGE_LIST_SEARCH_KEY}-${this.vdKey}`, ({type, effectCount}) => {
				if (type == 0) {
					this.vdInitData().then();
				} else {
					this.vdRefreshByCount(effectCount).then();
				}
			});
			// 设置初始值
			this.vdParams = this.vdDefaultParams();
		}

		protected beforeDestroy() {
			EventBus.$off(`${VD_PAGE_SYNC_PARAMS_KEY_2}-${this.vdKey}`);
			EventBus.$off(`${VD_PAGE_SYNC_LIST_KEY_2}-${this.vdKey}`);
			EventBus.$off(`${VD_PAGE_SYNC_SELECTED_KEY_2}-${this.vdKey}`);
			EventBus.$off(`${VD_PAGE_LIST_SEARCH_KEY}-${this.vdKey}`);
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
				this.vdOldParams = this.vdOldParams ? JSON.parse(JSON.stringify(this.vdParams)) : {};
			}
			return this.vdRefresh(data);
		}

		/**
		 * 刷新当前数据
		 * @param effectCount 影响个数
		 */
		public async vdRefreshByCount(effectCount?: number): Promise<UseResult<R[]>> {
			return this.vdRefresh(undefined, effectCount);
		}

		/**
		 * 刷新当前数据
		 * @param data 参数
		 * @param effectCount 影响个数
		 */
		public async vdRefresh(data?: P, effectCount?: number): Promise<UseResult<R[]>> {
			const getPage = () => {
				if (this.vdUsePage()) {
					if(effectCount && this.vdList.length + effectCount === 0){
						this.vdPage = 1;
					}
					return this.vdPage;
				}
				return undefined;
			};

			let _data = {
				...this.vdOldParams,
				page: getPage(),
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

		private get vdKey() {
			return findComponentByAttrName(this, 'vdTableMainMixin')?._uid;
		}

		// 参数
		public vdParams = {} as any;

		@Watch('vdParams', {deep: true})
		private vdUpdateParams(params: T) {
			EventBus.$emit(`${VD_PAGE_SYNC_PARAMS_KEY_2}-${this.vdKey}`, params);
		}

		public created() {
			EventBus.$on(`${VD_PAGE_SYNC_PARAMS_KEY_1}-${this.vdKey}`, (params: T) => this.vdParams = params);
		}

		protected beforeDestroy() {
			EventBus.$off(`${VD_PAGE_SYNC_PARAMS_KEY_1}-${this.vdKey}`);
		}

		/**
		 * 查询数据
		 */
		public vdSearch() {
			EventBus.$emit(`${VD_PAGE_LIST_SEARCH_KEY}-${this.vdKey}`, {type: 0});
		}

		/**
		 * 刷新数据列表
		 */
		public vdRefresh(effectCount?: number) {
			EventBus.$emit(`${VD_PAGE_LIST_SEARCH_KEY}-${this.vdKey}`, {type: 1, effectCount});
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

		private get vdKey() {
			return findComponentByAttrName(this, 'vdTableMainMixin')?._uid;
		}

		public vdList: Array<T> = [];

		// 多选内容
		public vdSelected = [];

		@Watch('vdList', {deep: true})
		private vdUpdateList(list: Array<T>) {
			EventBus.$emit(`${VD_PAGE_SYNC_LIST_KEY_2}-${this.vdKey}`, list);
		}

		@Watch('vdSelected', {deep: true})
		private vdUpdateSelected(list: Array<T>) {
			EventBus.$emit(`${VD_PAGE_SYNC_SELECTED_KEY_2}-${this.vdKey}`, list);
		}

		protected created() {
			EventBus.$on(`${VD_PAGE_SYNC_LIST_KEY_1}-${this.vdKey}`, (list: Array<T>) => this.vdList = list);
			EventBus.$on(`${VD_PAGE_SYNC_SELECTED_KEY_1}-${this.vdKey}`, (list: Array<T>) => this.vdSelected = list);
		}

		protected beforeDestroy() {
			EventBus.$off(`${VD_PAGE_SYNC_LIST_KEY_1}-${this.vdKey}`);
			EventBus.$off(`${VD_PAGE_SYNC_SELECTED_KEY_1}-${this.vdKey}`);
		}

		/**
		 * 同步选中项
		 * @param list 选中选项
		 */
		public vdSelectionChange(list: T[]) {
			this.vdSelected = list;
		}

		/**
		 * 查询数据
		 */
		public vdSearch() {
			EventBus.$emit(`${VD_PAGE_LIST_SEARCH_KEY}-${this.vdKey}`, {type: 0});
		}

		/**
		 * 刷新数据列表
		 */
		public vdRefresh(effectCount?: number) {
			EventBus.$emit(`${VD_PAGE_LIST_SEARCH_KEY}-${this.vdKey}`, {type: 1, effectCount});
		}
	}
}
