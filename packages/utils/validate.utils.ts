import { VdCommonService } from '../service/vd-common.service';
import { VdConfigService } from '../service/vd-config.service';
import { Vue } from 'vue-property-decorator';

/**
 * 用于表单验证
 * @param $refs refs
 * @param formName ref名称
 * @param success 成功回调
 * @param err 错误回调
 */
export const vdValidate = ($refs: { [key: string]: Vue | Element | Vue[] | Element[] }, formName: string | string[], success: () => void, err?: () => void): void => {
	if (!formName) {
		throw new Error('The parameter formName must be passed in！');
	}
	let formNames: string[] = [];
	if (VdCommonService.isString(formName)) {
		formNames = [formName as string];
	} else {
		formNames = formName as string[];
	}
	const result = VdConfigService.config.handleFormValidate($refs, formNames);

	if (!result) {
		success();
	} else {
		if (err) {
			err();
		}
	}
};
