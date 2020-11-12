import { createDecorator } from 'vue-class-component';
import { VdConfigService } from '../service/vd-config.service';
import { VdCommonService } from '../service/vd-common.service';
import { VdConfirmInfo } from '../model/request-options';

const noop = () => {
};

type getInfo = (...args) => VdConfirmInfo;

/**
 * 用于确认提示
 * @param info 消息
 * @constructor
 */
export const Confirm = (info: VdConfirmInfo | getInfo) => {
	return createDecorator((options, key) => {
		const originalMethod = options.methods[key] || noop;
		options.methods[key] = function wrapperMethod(...args) {
			let __info: VdConfirmInfo;
			if (VdCommonService.isFunction(info)) {
				const _info = info as getInfo;
				__info = _info.apply(this, args) as VdConfirmInfo;
			} else {
				__info = info as VdConfirmInfo;
			}
			VdConfigService.config.handleConfirm(__info).then(() => {
				originalMethod.apply(this, args);
			});
		};
	});
};
