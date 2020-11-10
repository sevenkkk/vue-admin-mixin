import { createDecorator } from 'vue-class-component';
import { VdConfigService } from '../service/vd-config.service';
import { VdCommonService } from '../service/vd-common.service';

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

		if (!formName) {
			throw new Error('必须指定formName');
		}
		let formNames: string[] = [];
		if (VdCommonService.isString(formName)) {
			formNames = [formName as string];
		} else {
			formNames = formName as string[];
		}
		options.methods[key] = function wrapperMethod(...args) {
			// @ts-ignore
			const result = VdConfigService.config.handleFormValidate(this.$refs, formNames);
			if (!result) {
				originalMethod.apply(this, args);
			}
		};
	});
};
