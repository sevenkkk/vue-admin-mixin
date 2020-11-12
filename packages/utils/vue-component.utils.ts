/**
 * 根据属性值找到对应节点位置
 * @param context
 * @param attrName
 */
export const findComponentByAttrName = (context: any, attrName: string) => {
	let parent = context.$parent;
	let target = parent.$data[attrName];

	while (parent && !target) {
		parent = parent.$parent;
		if (parent) {
			target = parent.$data[attrName];
		}
	}
	return parent;
};
