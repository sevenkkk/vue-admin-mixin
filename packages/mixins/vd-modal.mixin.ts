import { Component, Watch } from 'vue-property-decorator';
import { EventBus } from '../utils/event-bus.utils';
import { VdMixin } from './base/vd.mixin';

const VD_MODAL_OPEN_MODAL = 'vd-model-open-modal';
const VD_MODAL_CLOSE_MODAL = 'vd-model-close-modal';

/**
 * 页面模式
 */
export enum PageMode {
	ADD, // 添加
	UPDATE, // 更新
	CHECK // 查看
}

/**
 * 模态框返回值
 */
export interface VdModalResult {
	mode: PageMode;
	data: any;
	index: number;
}

export namespace VdModal {
	/**
	 * 模态框共通组件
	 */

		// @ts-ignore
	@Component
	export abstract class TargetMixin<T> extends VdMixin {

		public vdVisible = false;

		public vdModalData: any;

		public vdPageMode = PageMode.ADD;

		private _index = -1;

		// 返回值
		private _resolve: (result?: VdModalResult) => void;

		protected vdSetDefaultKey() {
			return '';
		}

		private vdOpenModalKey() {
			return `${VD_MODAL_OPEN_MODAL}-${this.vdSetDefaultKey()}`;
		}

		private vdCloseModalKey() {
			return `${VD_MODAL_CLOSE_MODAL}-${this.vdSetDefaultKey}`;
		}

		public get vdIsUpdate() {
			return this.vdPageMode == PageMode.UPDATE;
		}

		public get vdIsAdd() {
			return this.vdPageMode == PageMode.ADD;
		}

		public get vdActionText(): string {
			switch (this.vdPageMode) {
				case PageMode.ADD:
					return '添加';
				case PageMode.UPDATE:
					return '编辑';
				case PageMode.CHECK:
					return '查看';
			}
		}

		protected beforeCreate() {
			setTimeout(() => {
				EventBus.$on(this.vdOpenModalKey(), ({data, mode, resolve, isShow, index}: { data: T; mode: PageMode; resolve: any, isShow: boolean; index?: number; }) => {
						if (isShow) {
							this.vdModalData = data;
							this.vdVisible = isShow;
							this.vdPageMode = mode;
							this._resolve = resolve;
							this._index = index || -1;
						} else {
							this.vdVisible = false;
						}
					},
				);
			}, 300);
		}

		public beforeDestroy() {
			EventBus.$off(this.vdCloseModalKey());
		}

		/**
		 * 打开model加载数据
		 * @param data 传入数据
		 * @param index 传入索引
		 */
		protected abstract vdLoadModalData(data?: T, index?: number): void;

		/**
		 * 清理modal数据
		 */
		public abstract vdClearModal(): void;

		/**
		 * 监听是否打开
		 * @param visible
		 */
		@Watch('vdVisible')
		private vdGetShow(visible: boolean) {
			if (visible) {
				this.vdLoadModalData(this.vdModalData, this._index);
			} else {
				this.vdClearModal();
			}
		}

		/**
		 * 关闭模态框
		 */
		public vdCloseModal() {
			this._resolve();
			this.vdVisible = false;
		}

		/**
		 * 关闭对话框并且传递数据
		 * @param data 数据
		 */
		public vdCloseModalCallback(data?: any) {
			const result = {
				mode: this.vdPageMode,
				data,
				index: this._index,
			};
			EventBus.$emit(this.vdCloseModalKey(), result);
			this._resolve(result);
			this.vdVisible = false;
		}
	}

	/**
	 * 模态框关闭的回调
	 */
	@Component
	export class CallbackMixin extends VdMixin {

		/**
		 * 设置默认key（页面出现多个modal时进行区分）
		 */
		protected vdSetDefaultKey() {
			return '';
		}

		// 当前mode
		private _vdPageMode = PageMode.ADD;

		public get vdIsUpdate() {
			return this._vdPageMode == PageMode.UPDATE;
		}

		public get vdIsAdd() {
			return this._vdPageMode == PageMode.ADD;
		}

		protected vdOpenModalKey() {
			return `${VD_MODAL_OPEN_MODAL}-${this.vdSetDefaultKey()}`;
		}

		protected vdCloseModalKey() {
			return `${VD_MODAL_CLOSE_MODAL}-${this.vdSetDefaultKey()}`;
		}

		protected beforeCreate() {
			EventBus.$on(this.vdCloseModalKey(), ({data, mode, index}: { data: any; mode: PageMode; index: number }) => {
					this._vdPageMode = mode;
					this.handleModalCallback(data, index);
				},
			);
		}

		protected beforeDestroy() {
			EventBus.$off(this.vdOpenModalKey());
		}

		/**
		 * 获取返回值监听
		 * @param data 数据
		 * @param index 索引
		 */
		public handleModalCallback(data?: any, index?: number) {
		}
	}

	/**
	 * 用于模态框控制、打开 附带模态框关闭的回调
	 */
	@Component
	export class CrlMixin extends CallbackMixin {

		public vdOpenModalByAdd(data?: any): Promise<VdModalResult | undefined> {
			return new Promise((resolve) => {
				this.vdOpenByPageMode(PageMode.ADD, resolve, data);
			});
		}

		public vdOpenModalByUpdate(data?: any, index?: number): Promise<VdModalResult | undefined> {
			return new Promise((resolve) => {
				this.vdOpenByPageMode(PageMode.UPDATE, resolve, data, index);
			});

		}

		public vdOpenModalByCheck(data?: any): Promise<VdModalResult | undefined> {
			return new Promise((resolve) => {
				this.vdOpenByPageMode(PageMode.CHECK, resolve, data);
			});
		}

		/**
		 * 打开模态框
		 */
		private vdOpenByPageMode(pageMode: PageMode, resolve: any, data?: any, index?: number) {
			EventBus.$emit(this.vdOpenModalKey(), {
				data,
				mode: pageMode,
				resolve,
				isShow: true,
				index,
			});
		}
	}

}
