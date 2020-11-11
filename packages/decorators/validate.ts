import { createDecorator } from 'vue-class-component';
import { vdValidate } from '../utils/validate.utils';

const noop = () => {
};

/**
 * 用于表单验证
 * @param formName ref名称
 * @constructor
 */
export const Validate = (formName: string | string[]) => {
	return createDecorator((options, key) => {
		const originalMethod = options.methods[key] || noop;
		options.methods[key] = function wrapperMethod(...args) {
			vdValidate(this.$refs, formName, () => originalMethod.apply(this, args));
		};
	});
};
