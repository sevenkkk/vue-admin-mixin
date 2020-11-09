import { Component, Mixins } from 'vue-property-decorator';
import { vdLoadObjMixin } from './vd-load-obj.mixin';
import { vdSubmitMixin } from './vd-submit.mixin';

@Component
// @ts-ignore
export class vdEditMixin<T> extends Mixins<vdLoadObjMixin<T>, vdSubmitMixin<T, string>>(
	vdLoadObjMixin,
	vdSubmitMixin,
) {
}
