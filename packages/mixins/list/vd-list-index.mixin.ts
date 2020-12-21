import { Component } from 'vue-property-decorator';
import { VdListMixin } from './vd-list.mixin';

@Component
export class VdListIndexMixin<P, R> extends VdListMixin<P, R> {
	// 返回值列表
	public vdList: R[] = [];

	// 当前索引
	public vdIndex = 0;

	// 当前选中的对象
	protected get vdActive(): R | undefined {
		return this.vdList.length > this.vdIndex
			? this.vdList[this.vdIndex]
			: undefined;
	}
}
