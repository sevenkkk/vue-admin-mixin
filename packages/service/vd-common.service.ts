/**
 * 共通方法
 */
export class VdCommonService {
	/**
	 *  判断是否是字符串
	 * @param target
	 */
	static isString(target: any) {
		return target && typeof target == 'string' && target.constructor == String;
	}

	/**
	 *  判断是否是对象
	 * @param target 对象
	 */
	static isObject(target: any) {
		return target && typeof target == 'object' && target.constructor == Object;
	};

	/**
	 *  判断是否是数组
	 * @param target 对象
	 */
	static isArray(target: any) {
		return target && typeof target == 'object' && target.constructor == Array;
	};
}
