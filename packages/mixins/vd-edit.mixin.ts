import { Component, Mixins } from 'vue-property-decorator';
import { VdObjMixin } from './vd-obj.mixin';
import { VdSubmitMixin } from './vd-submit.mixin';

@Component
// @ts-ignore
export class VdEditMixin<T> extends Mixins<VdObjMixin<T>, VdSubmitMixin<T, string>>(
	VdObjMixin,
	VdSubmitMixin,
) {
}
