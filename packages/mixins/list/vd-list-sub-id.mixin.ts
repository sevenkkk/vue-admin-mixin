import { Component, Watch } from 'vue-property-decorator';
import { VdListIdMixin } from './vd-list-id.mixin';

// @ts-ignore
@Component
abstract class VdBaseListSubIdMixin<P, R, S> extends VdListIdMixin<P, R> {

	// 当前选中二级ID
	public vdSubId: string = '';

	@Watch('vdId', {immediate: true})
	watchVdId() {
		this.resetVdSubId(this.vdSubList);
	}

	@Watch('vdSubList', {deep: true})
	watchVdSubList(list: S[]) {
		this.resetVdSubId(list);
	}

	/**
	 * 设置选中的id
	 * @param list
	 */
	public resetVdSubId(list: S[]) {
		if (!((list || []).some(item => String(item[this.vdSubIdAttrName()]) === this.vdSubId))) {
			this.setSubIdByFirst(list);
		}
	}

	/**
	 * 设置默认第一项
	 * @param list 列表
	 */
	public setSubIdByFirst(list?: S[]) {
		const _list = list || this.vdSubList;
		this.vdSubId = _list.length > 0 ? String(_list[0][this.vdSubIdAttrName()]) : '';
	}

	// 设置二级列表key
	public abstract vdSubAttrName(): keyof R;

	// 二级列表
	public get vdSubList(): S[] {
		return this.vdActive ? ((this.vdActive[this.vdSubAttrName()] || []) as S[]) : [];
	}

	// 设置二级分类key
	public abstract vdSubIdAttrName(): keyof S;

	// 当前选中的对象
	public get vdSubActive(): S | undefined {
		return this.vdGetSubActive(this.vdSubList, this.vdSubId);
	}

	public vdGetSubActive(list: S[], vdSubId?: string) {
		return list.find(item => String(item[this.vdSubIdAttrName()]) === vdSubId);
	}
}

@Component
// @ts-ignore
export class VdListSubIdMixin<P, R, S> extends VdBaseListSubIdMixin<P, R, S> {
}
