import { VdCommonService } from '../service/vd-common.service';
import { createDecorator } from 'vue-class-component';

const noop = () => {
};

/**
 * 用于区分多个modal回调
 * @param pipe 管道
 * @constructor
 */
export function ModalCallback(pipe?: string) {
	return createDecorator((options, key) => {
		if ('vdModalCallback' === key) {
			throw new Error('vdModalCallback is a callback function, please change another name！');
		}

		/* eslint-disable */
		// @ts-ignore
		const original = options.methods['vdModalCallback'] || noop;

		const originalMethod = options.methods[key] || noop;

		/* eslint-disable */
		// @ts-ignore
		options.methods['vdModalCallback'] = function wrapperMethod(...args) {
			original.apply(this, args);
			if (args && VdCommonService.isArray(args) && args.length >= 2 && args[1] === pipe) {
				originalMethod.apply(this, args);
			}
		};

	});
}
