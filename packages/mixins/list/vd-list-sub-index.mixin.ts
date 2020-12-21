import { Component } from 'vue-property-decorator';
import { VdListIndexMixin } from './vd-list-index.mixin';

// @ts-ignore
@Component
export abstract class VdBaseListSubIndexMixin<P, R> extends VdListIndexMixin<P, R> {
	// 选择二级分类索引
	public vdSubIndex = 0;

	// 设置二级分类key
	public abstract vdSubIdAttrName(): keyof R;

	// 获取二级分类对象选中值
	public get vdSubActive() {
		if (!this.vdSubIdAttrName()) {
			return undefined;
		}
		return this.vdActive
			? /* eslint-disable */
			// @ts-ignore
			this.vdActive[this.vdSubIdAttrName()]
				? /* eslint-disable */
				// @ts-ignore
				this.vdActive[this.vdSubIdAttrName()].length > this.vdSubIndex
					? /* eslint-disable */
					// @ts-ignore
					this.vdActive[this.vdSubIdAttrName()][this.vdSubIndex]
					: undefined
				: undefined
			: undefined;
	}
}

@Component
// @ts-ignore
export class VdListSubIndexMixin<P, R> extends VdBaseListSubIndexMixin<P, R> {
}
