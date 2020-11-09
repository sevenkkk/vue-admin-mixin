import { Component } from 'vue-property-decorator';
import { vdMixin } from './vd.mixin';

@Component
export class vdRespObjMixin<T> extends vdMixin {
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
