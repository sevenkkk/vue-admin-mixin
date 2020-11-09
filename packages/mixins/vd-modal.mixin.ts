import { Component, Watch } from 'vue-property-decorator';
import { EventBus } from '../utils/event-bus.utils';
import { VdMixin } from './base/vd.mixin';

const VD_MODAL_OPEN_MODAL = 'vd-model-open-modal';
const VD_MODAL_CLOSE_MODAL = 'vd-model-close-modal';

const VD_MODAL_DEFAULT_PIPE_KEY = 'vd-pipe-key';
const VD_MODAL_DEFAULT_INDEX_KEY = -1;

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
	mode: PageMode; // 模型
	data: any; // 数据
	index: number; // 索引
}

export namespace VdModal {
	/**
	 * 模态框共通组件
	 */

		// @ts-ignore
	@Component
	abstract class BaseTargetMixin extends VdMixin {

		// 控制模态框显示隐藏
		public vdVisible = false;

		// 打开传入模态框数据
		public vdInputData: any;

		// 当前模式
		public vdPageMode = PageMode.ADD;

		// 对应数据索引，一般是类表数据索引
		private _index = VD_MODAL_DEFAULT_INDEX_KEY;

		// 打开模态框的回调
		private _resolve: (result?: VdModalResult) => void;

		// 管道，用于匹配打开的模态框
		protected vdSetPipe(): string {
			return VD_MODAL_DEFAULT_PIPE_KEY;
		}

		// 是否是更新
		public get vdIsUpdate() {
			return this.vdPageMode == PageMode.UPDATE;
		}

		// 是否是添加
		public get vdIsAdd() {
			return this.vdPageMode == PageMode.ADD;
		}

		// 显示对应模式的文本
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

		/**
		 * 接受监听事件
		 */
		protected created() {
			setTimeout(() => {
				EventBus.$on(`${VD_MODAL_OPEN_MODAL}-${this.vdSetPipe()}`,
					({data, mode, resolve, isShow, index}) => {
						if (isShow) {
							this.vdInputData = data;
							this.vdVisible = isShow;
							this.vdPageMode = mode;
							this._resolve = resolve;
							this._index = index;
						} else {
							this.vdVisible = false;
						}
					},
				);
			}, 300);
		}

		protected beforeDestroy() {
			EventBus.$off(`${VD_MODAL_OPEN_MODAL}-${this.vdSetPipe()}`);
		}

		/**
		 * 监听是否打开
		 * @param visible
		 */
		@Watch('vdVisible')
		private vdGetShow(visible: boolean) {
			if (visible) {
				this.vdShowModal(this.vdInputData, this._index);
			} else {
				this.vdHiddenModal();
			}
		}

		/**
		 * 打开模态框回调
		 * @param data 传入数据
		 * @param index 传入索引
		 */
		protected vdShowModal(data?: any, index?: number) {
		};

		/**
		 * 关闭模态框回调
		 */
		protected vdHiddenModal() {
		};

		/**
		 * 关闭模态框
		 */
		public vdCloseModal() {
			this._resolve();
			this.vdVisible = false;
		}

		/**
		 * 关闭对话框 并且传值触发回调
		 * @param data 数据
		 */
		public vdCloseModalCallback(data?: any) {
			const result = {
				mode: this.vdPageMode,
				data,
				index: this._index,
			};
			EventBus.$emit(`${VD_MODAL_CLOSE_MODAL}-${this.vdSetPipe()}`, result);
			this._resolve(result);
			this.vdVisible = false;
		}
	}


	@Component
	// @ts-ignore
	export class TargetMixin extends BaseTargetMixin {

	}

	/**
	 * 模态框关闭的回调
	 */
	@Component
	export class CallbackMixin extends VdMixin {

		/**
		 * 设置默认key（页面出现多个modal时进行区分）
		 */
		public vdSetPipeKey(): number {
			return 1;
		}

		// 当前mode
		private _vdPageMode = PageMode.ADD;

		public get vdIsUpdate() {
			return this._vdPageMode == PageMode.UPDATE;
		}

		public get vdIsAdd() {
			return this._vdPageMode == PageMode.ADD;
		}

		protected created() {
			EventBus.$on(`${VD_MODAL_CLOSE_MODAL}-${this.vdSetPipeKey()}`, ({data, mode, index}) => {
					this._vdPageMode = mode;
					this.vdModalCallback(data, index);
				},
			);
		}

		protected beforeDestroy() {
			EventBus.$off(`${VD_MODAL_OPEN_MODAL}-${this.vdSetPipeKey()}`);
		}


		/**
		 * 获取返回值监听
		 * @param data 数据
		 * @param index 索引
		 */
		public vdModalCallback(data?: any, index?: number) {
		}
	}

	/**
	 * 用于模态框控制、打开 附带模态框关闭的回调
	 */
	@Component
	export class CrlMixin extends CallbackMixin {

		/**
		 * 打开模态框-传入索引（添加）
		 * @param data 传入的数据
		 * @param index 索引
		 * @param pipe 管道，用于匹配打开的模态框
		 */
		public vdOpenModalByAddIndex(data: any, index: number, pipe = VD_MODAL_DEFAULT_PIPE_KEY) {
			this.vdOpenModal(PageMode.ADD, data, index, pipe).then();
		}

		/**
		 * 打开模态框（添加）
		 * @param data 传入的数据
		 * @param pipe 管道，用于匹配打开的模态框
		 */
		public vdOpenModalByAdd(data?: any, pipe = VD_MODAL_DEFAULT_PIPE_KEY) {
			this.vdOpenModalByAddIndex(data, VD_MODAL_DEFAULT_INDEX_KEY, pipe);
		}

		/**
		 * 打开模态框-传入索引（修改）
		 * @param data 传入的数据
		 * @param index 索引
		 * @param pipe 管道，用于匹配打开的模态框
		 */
		public vdOpenModalByUpdateIndex(data: any, index: number, pipe = VD_MODAL_DEFAULT_PIPE_KEY) {
			this.vdOpenModal(PageMode.UPDATE, data, index, pipe).then();
		}

		/**
		 * 打开模态框（修改）
		 * @param data 传入的数据
		 * @param pipe 管道，用于匹配打开的模态框
		 */
		public vdOpenModalByUpdate(data?: any, pipe = VD_MODAL_DEFAULT_PIPE_KEY) {
			this.vdOpenModalByUpdateIndex(data, VD_MODAL_DEFAULT_INDEX_KEY, pipe);

		}

		/**
		 * 打开模态框-传入索引（查看）
		 * @param data 传入的数据
		 * @param index 索引
		 * @param pipe 管道，用于匹配打开的模态框
		 */
		public vdOpenModalByCheckIndex(data: any, index: number, pipe = VD_MODAL_DEFAULT_PIPE_KEY) {
			this.vdOpenModal(PageMode.CHECK, data, index, pipe).then();
		}

		/**
		 * 打开模态框-传入索引（查看）
		 * @param data 传入的数据
		 * @param pipe 管道，用于匹配打开的模态框
		 */
		public vdOpenModalByCheck(data?: any, pipe = VD_MODAL_DEFAULT_PIPE_KEY) {
			this.vdOpenModalByCheckIndex(data, VD_MODAL_DEFAULT_INDEX_KEY, pipe);
		}


		/**
		 * 打开模态框
		 * @param pipe 管道，用于匹配打开的模态框
		 * @param mode 页面模型
		 * @param data 数据
		 * @param index 索引
		 */
		public vdOpenModal(mode: PageMode, data?: any, index?: number, pipe = VD_MODAL_DEFAULT_PIPE_KEY): Promise<VdModalResult | undefined> {
			return new Promise((resolve) => {
				EventBus.$emit(`${VD_MODAL_OPEN_MODAL}-${pipe}`, {
					data,
					mode,
					resolve,
					isShow: true,
					index,
				});
			});
		}
	}

}
