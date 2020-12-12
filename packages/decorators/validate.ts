import { createDecorator } from "vue-class-component";
import { vdValidate } from "../utils/validate.utils";

const noop = () => {};

type getRefs = (...args) => any;

/**
 * 用于表单验证
 * @param formName ref名称
 * @param refs 当前ref回调
 * @constructor
 */
export const Validate = (formName: string | string[], refs?: getRefs) => {
  return createDecorator((options, key) => {
    const originalMethod = options.methods[key] || noop;
    options.methods[key] = function wrapperMethod(...args) {
      vdValidate(refs ? refs.apply(this, args) : this.$refs, formName, () =>
        originalMethod.apply(this, args)
      );
    };
  });
};
