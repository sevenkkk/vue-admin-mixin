import { Component, Watch } from 'vue-property-decorator';
import { VdListMixin } from './vd-list.mixin';

// @ts-ignore
@Component
abstract class VdBaseListIdMixin<P, R> extends VdListMixin<P, R> {
	// 当前选中ID
	public vdId: string = '';

	// 设置一级分类key
	public abstract vdIdAttrName(): keyof R;

	@Watch('vdList', {deep: true, immediate: true})
	watchVdList(list: R[]) {
		this.resetVdId(list);
	}

	/**
	 * 设置选中的id
	 * @param list
	 */
	public resetVdId(list: R[]) {
		if ((!(list || []).some(item => String(item[this.vdIdAttrName()]) === this.vdId))) {
			this.setIdByFirst(list);
		}
	}

	/**
	 * 设置默认第一项
	 * @param list 列表
	 */
	public setIdByFirst(list?: R[]) {
		const _list = list || this.vdList;
		this.vdId = _list.length > 0 ? String(_list[0][this.vdIdAttrName()]) : '';
	}

	// 当前选中的对象
	public get vdActive(): R | undefined {
		return this.vdGetActive(this.vdList || [], this.vdId);
	}

	public vdGetActive(list: R[], vdId?: string) {
		return list.find(item => String(item[this.vdIdAttrName()]) === vdId);
	}
}

@Component
// @ts-ignore
export class VdListIdMixin<P, R> extends VdBaseListIdMixin<P, R> {
}
