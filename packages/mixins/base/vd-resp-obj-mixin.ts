import { Component } from 'vue-property-decorator';
import { VdMixin } from './vd.mixin';

@Component
export class VdRespObjMixin<T> extends VdMixin {
	// 返回值
	public vdData: T = {} as any;

	public vdDefaultData(): T {
		return {} as any;
	}

	public created() {
		// 设置初始值
		this.vdResetData();
	}

	public vdResetData() {
		this.vdData = this.vdDefaultData();
	}
}
