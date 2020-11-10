# Vue Admin Mixin

For the development of admin project, some commonly used mixins are implemented for rapid development, code reuse and code specification.

This library fully depends on [vue-property-decorator](https://github.com/kaorun343/vue-property-decorator), so please read its README before using this library.

## License

MIT License

## Install

```bash
npm i -S vue-admin-mixin
```

## Usage

There are several Mixins:

- [`VdMixin`]
- [`VdTable.MainMixin`]
- [`VdTable.ParamMixin`]
- [`VdTable.ListMixin`]
- [`VdListMixin`]
- [`VdObjMixin`]
- [`VdSubmitMixin`]
- [`VdEditMixin`]
- [`VdModal.CrlMixin`]
- [`VdModal.TargetMixin`]
- [`VdModal.CallbackMixin`]

### <a id="VdMixin"></a> `VdMixin` mixin
### 提供基本方法，所有的Mixin都继承了这个类

VdMixin 属性:

 propertie                   | return type         | describe
 --------------------------- | ------------------- | --------------------------------------
 vdLoading                   | boolea              | 正在加载数据

---

VdMixin 方法:

 method                                                             | return type          	         | describe
 ------------------------------------------------------------------ | ---------------------------------- | --------------------------
 vdFetch() 					       	            | T                                  | 发送api基础类（也可以直接用 vdFetch 充httpUtil获取方法）
 vdConfirm(info: VdConfirmInfo)				            | void                               | 确认提示
 vdMessage(fetch,options)				            | void                               | 请求处理消息信息
 vdRequest(url: string, data?: any, options)                        | Promise<UseResult<T>>              | 发送请求api，实际上是vdConfirm、vdMessage的组合使用

---
```ts
options:
interface VdRequestOptions {
	load?: boolean; // 是否是获取请求
	loading?: boolean; // 是否加载loading框
	message?: VdMessageOptions; // 处理message选项
	confirm?: VdConfirmInfo; // 确认提示消息
}
```

### <a id="VdTable"></a> `VdTable.MainMixin<P, R>` mixin
### 用于列表分页查询的插件。

```html
<template>
  <platform-list-search></platform-list-search>
  <cc-table-container :total="vdTotal" v-loading="vdTLoading" @loadByPage="vdRefreshByPage">
    <platform-list-table></platform-list-table>
  </cc-table-container>
</template>
```

```ts
import { Component } from 'vue-property-decorator';
import { VdTable } from 'vue-admin-mixin';

@Component({
	components: { PlatformListSearch, PlatformListTable },
})
export default class PlatformList extends VdTable.MainMixin<PlatformSearch, Platform> {
	
  	/**
	 * 设置默认请求参数
	 */
	public defaultParams(): PlatformSearch {
		return { searchText: '' };
	}

	/**
	 * 加载数据
	 */
	public created() {
		this.vdInitData(API_PLATFORM_LIST).then();
	}
}
```

### 建议搜索区域是一个组件，如果是这样的话， 可以使用【VdTable.ParamMixin】来同步列表的请求参数和刷新事件。

```html
<template>
 <el-form :inline="true" :model="vdParams" class="demo-form-inline">
  <el-form-item label="筛选">
    <el-input v-model="vdParams.searchText" placeholder="请输入筛选条件" />
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="vdSearch">搜索</el-button>
    <el-button @click="vdClear">清空</el-button>
  </el-form-item>
 </el-form>
</template>
```

```ts
import { Component } from 'vue-property-decorator';
import { VdTable } from 'vue-admin-mixin';

@Component
export default class PlatformListSearch extends VdTable.ParamMixin<PlatformSearch> {
}
```

### 建议table结果页面是一个组件， 可以使用【VdTable.ListMixin】来同步列表的请求参数和刷新事件。

```html
<el-table :data="vdList" stripe>
  <el-table-column prop="name" label="XXX" width="168">
  </el-table-column>
  <div slot="vdLEmpty">
    <moy-empty />
  </div>
</el-table>
```

```ts
import { Component } from 'vue-property-decorator';
import { VdTable } from 'vue-admin-mixin';

@Component
export default class PlatformListTable extends VdTable.ListMixin<Platform> {
}
```
---

VdTable.MainMixin 属性:

 propertie                   | return type         | describe
 --------------------------- | ------------------- | --------------------------------------
 vdTotal                     | number              | 数据总条数
 vdPage                      | number              | 当前页码
 vdPageSize                  | number              | 每页显示条数
 vdSelected                  | R[]                 | 多选内容
 vdList                      | R[]                 | 数据列表
 vdParams                    | P                   | 请求参数
 vdLLoading                  | boolean             | 是否正在加载
 vdLEmpty                    | boolean             | 是否当前数据为空数据
 vdLHasData                  | boolean             | 是否有数据
 vdLEmpty                    | boolean             | 是否当前数据为空数据
 vdIndex                     | number              | 当前索引
 vdActive                    | R  undefined        | 当前选中的对象 （Only get is supported）
 vdIsDefaultSet              | boolean             | 请求结果是否直接赋值给 vdList

---

VdTable.MainMixin 方法:

 method                                                                  | return type          	         | describe
 ----------------------------------------------------------------------- | ------------------------------------- | --------------------------
 vdUsePage()                                                             | boolean                               | 重写可以指定是否使用分页（默认是true）
 vdDefaultParams()                                                       | P                 		         | 设置默认参数，可以重写(默认是{})
 vdInitData(path?: string, data?: P)                                     | Promise<UseResult<R[]>>               | 初始化数据（vdPage = 1）
 vdRefresh(data?: P)                                                     | Promise<UseResult<R[]>>               | 刷新数据（页码不变）
 vdRefreshByPage(data: { page?: number; pageSize?: number })             | void                 		 | 根据分页参数变化,重新加载数据
 vdSetListPath(path?: string)                                            | void              		         | 设置请求参数，vdInitData 时会自动设置到内部变量上

---

VdTable.ParamMixin 属性:

 propertie                   | return type         | describe
 --------------------------- | ------------------- | --------------------------
 vdParams                    | number              | 列表请求参数(同步 VdTable.MainMixin里的vdParams)

---

VdTable.ParamMixin 方法:

 method                      | return type          	           	         | describe
 --------------------------- | ------------------------------------------------- | --------------------------
 vdSearch                    | void                                              | 查询数据（实际上调用的是 VdTable.MainMixin里的vdInitData方法）
 vdRefresh                   | void                                              | 刷新数据（实际上调用的是 VdTable.MainMixin里的vdRefresh方法）
 vdClear                     | void                                              | 清空参数（清空并且同步父组件到vdParams）

---

VdTable.ListMixin 属性:

 propertie                   | return type         | describe
 --------------------------- | ------------------- | --------------------------
 vdList                      | Array<T>            | 列表请求返回值(同步 VdTable.MainMixin里的vdList)

---

VdTable.ParamMixin 方法:

 method                      | return type          	           	         | describe
 --------------------------- | ------------------------------------------------- | --------------------------
 vdSearch                    | void                                              | 查询数据（实际上调用的是 VdTable.MainMixin里的vdInitData方法）
 vdRefresh                   | void                                              | 刷新数据（实际上调用的是 VdTable.MainMixin里的vdRefresh方法）

---
### <a id="VdModal"></a> `VdModal.CrlMixin` `VdModal.TargetMixin` `VdModal.CallbackMixin` mixin
### 用于控制模态框的打开、隐藏、数据传值和回值。 VdModal.CrlMixin 继承了 VdModal.CallbackMixin 所以可以使用 CallbackMixin 的属性和方法。

```html
<template>
   <div @click="vdOpenModalByAdd()">打开添加modal</div>
   <div @click="vdOpenModalByUpdate(data)">打开修改modal</div>
   <div @click="handleOpenModal(data).then()">也可以这样调用</div>
</template>
```

```ts
import { Component } from 'vue-property-decorator';
import { VdModal } from 'vue-admin-mixin';

@Component({
	components: { Modal1 },
})
export default class ModalTest extends VdModal.CrlMixin {
	/**
	 * 打开模态框方法
	 */
       public async handleOpenModal(data: any) {
		const result = await this.vdOpenModal(PageMode.UPDATE, data);
	}
	/**
	 * 模态框回调
	 */
	public vdHandleModalCallback(data: any, pipe?: string) {
		if (this.vdIsUpdate) {
			this.loadDetailById(id).then();
		} else {
			this.loadList().then();
		}
	}
	/**
	 * 如果多个modal回调监听使用pipe区分
	 */
	@ModalCallback('pipeKey')
	public vdHandleModalCallbackByPipeKey(data: any) {
		if (this.vdIsUpdate) {
			this.loadDetailById(id).then();
		} else {
			this.loadList().then();
		}
	}
}
```
 **Note that:**
 ### 如果多个想控制多个modal的话， 使用pipe来解决， 打开时传入pipe， 接受时可以根据pipe来区分。 另一种方式使用@ModalCallback('pipeKey')注解来实现回调监听(推荐使用)。


### VdModal.TargetMixin，模态框组件继承TargetMixin，在vdShowModal回调函数上可以接受到传入的数据，vdCloseModalCallback方法可以回传数据到CrlMixin或者CallbackMixin上。

```html
<template>
   <el-dialog :title="vdActionText + 'XXX'" :visible.sync="vdVisible">
      <span slot="footer" class="dialog-footer">
	 <el-button @click="vdCloseModal">取 消</el-button>
	 <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
   </el-dialog>
</template>
```

```ts
import { Component } from 'vue-property-decorator';
import { VdModal } from 'vue-admin-mixin';

@Component
export default class Modal1 extends VdModal.TargetMixin {
	/**
	 * 打开模态框回调
	 */
	public vdShowModal(data?: any): void {
	}

	/**
	 * 关闭模态框回调
	 */
	public vdHiddenModal(): void {
	}
	
	/**
	 * 提交请求
	 */
	public handleSubmit() {
		// 关闭模态框并且回传值过去
		this.vdCloseModalCallback(this.data.id);
	}
}
```

---

VdModal.CrlMixin 方法（继承了CallbackMixin所以拥有CallbackMixin的方法和属性）:

 method                                                              | return type                          | describe
 ------------------------------------------------------------------- | ------------------------------------ | -----------------------
 vdOpenModalByAdd(data?: any, pipe = '')                             | void                    		    | 打开模态框（添加）
 vdOpenModalByUpdate(data?: any, pipe = '')                          | void                    		    | 打开模态框（修改）
 vdOpenModalByCheck(data?: any, pipe = '')                           | void                                 | 打开模态框（查看）
 vdOpenModal(mode: PageMode, data?: any, pipe = '')                  | Promise<VdModalResult undefined>   | 打开模态框
 
---

VdModal.TargetMixin 属性:

 propertie                   | return type         | describe
 --------------------------- | ------------------- | --------------------------
 vdVisible                   | boolean             | 控制模态框显示隐藏
 vdInputData                 | any                 | 打开传入模态框数据
 vdPageMode                  | PageMode            | 当前模式
 vdIsUpdate                  | boolean             | 是否是更新 （Only get is supported）
 vdIsAdd                     | boolean             | 是否是添加 （Only get is supported）
 vdActionText                | string              | 显示对应模式的文本 （Only get is supported）

---

VdModal.TargetMixin 方法:

 method                      		 | return type          	           	     | describe
 --------------------------------------- | ------------------------------------------------- | --------------------------
 vdSetPipe()                   		 | string                                            | 管道，用于匹配打开的模态框(多个modal的时候使用, 或者给modal组件传入pipe属性)
 vdShowModal(data?: any)                 | void                                              | 打开模态框回调
 vdHiddenModal()               		 | void                                              | 关闭模态框回调
 vdCloseModal()                		 | void                                              | 关闭模态框
 vdCloseModalCallback(data?: any)        | void                                              | 关闭模态框并且传值触发回调

---

VdModal.CallbackMixin 属性:

 propertie                   | return type         | describe
 --------------------------- | ------------------- | --------------------------
 vdIsUpdate                  | boolean             | 是否是更新
 vdIsAdd                     | boolean             | 是否是添加

---

VdModal.CallbackMixin 方法:

 method                                         | return type          	           	 	    | describe
 -----------------------------------------------| ------------------------------------------------- | --------------------------
 vdModalCallback(data?: any, pipe?: string)     | void                                              | 模态框关闭时的回调函数（或者可以使用@ModalCallback('pipeKey‘)来区分不同pipe）
 
---

### <a id="VdListMixin"></a> `VdListMixin<P, R>` mixin
### 用于获取数组对象

VdListMixin 属性:

 propertie                   | return type         | describe
 --------------------------- | ------------------- | --------------------------------------
 vdList                      | R[]                 | 数据列表
 vdParams                    | P                   | 请求参数
 vdLLoading                  | boolean             | 是否正在加载
 vdLEmpty                    | boolean             | 是否当前数据为空数据
 vdLHasData                  | boolean             | 是否有数据
 vdIndex                     | number              | 当前索引
 vdActive                    | R  undefined        | 当前选中的对象 （Only get is supported）
 vdIsDefaultSet              | boolean             | 请求结果是否直接赋值给 vdList
 vdSubIndex                  | number              | 选择二级分类索引
 vdSubActive                 | number              | 当前选中二级的对象 （Only get is supported）

---

VdListMixin 方法:

 method                                                                  | return type          	         | describe
 ----------------------------------------------------------------------- | ------------------------------------- | --------------------------
 vdSetSubAttr()                                                          | void                                  | 设置二级属性字段
 vdDefaultParams()                                                       | P                 		         | 设置默认参数，可以重写(默认是{})
 vdLoadList(path?: string, data?: P)                                     | Promise<UseResult<R[]>>               | 加载数据
 vdSetListPath(path?: string)                                            | void              		         | 设置请求参数，vdLoadList 时会自动设置到内部变量上

---

### <a id="VdObjMixin"></a> `VdObjMixin<P, R>` mixin
### 用于获取数组对象

VdObjMixin 属性:

 propertie                   | return type         | describe
 --------------------------- | ------------------- | --------------------------------------
 vdData                      | R[]                 | 返回数据
 vdOLoading                  | boolean             | 是否正在加载
 vdOEmpty                    | boolean             | 是否当前数据为空数据
 vdOHasData                  | boolean             | 是否有数据

---

VdObjMixin 方法:

 method                                                             | return type          	         | describe
 ------------------------------------------------------------------ | ---------------------------------- | --------------------------
 vdDefaultData() 						    | T                                  | 设置默认值，可以重写父类方法
 vdResetData()						            | void                               | 重置默认值
 vdLoadData(path?: string, params?: any)                            | void                               | 加载数据
 vdLoadSuccess(result?: T)                                          | void                 	         | 加载数据回调，可以重写父类方法
 vdLoadError(err?: any)                                             | void                               | 加载数据失败，可以重写父类方法
 vdSetListPath(path?: string)                                       | void              		 | 设置请求参数，vdLoadData 时会自动设置到内部变量上

---

### <a id="VdSubmitMixin"></a> `VdSubmitMixin<P, R>` mixin
### 用于表单提交

VdSubmitMixin 属性:

 propertie                   | return type         | describe
 --------------------------- | ------------------- | --------------------------------------
 vdData                      | R[]                 | 返回数据
 vdSLoading                  | boolean             | 是否正在加载
 vdOEmpty                    | boolean             | 是否当前数据为空数据
 vdOHasData                  | boolean             | 是否有数据

---

VdSubmitMixin 方法:

 method                                                             | return type          	         | describe
 ------------------------------------------------------------------ | ---------------------------------- | --------------------------
 vdDefaultData() 						    | T                                  | 设置默认值，可以重写父类方法
 vdResetData()						            | void                               | 重置默认值
 vdSubmit(path: string, data?: T, options)                          | void                               | 提交数据（options:{ merge: boolean } = {merge: true}）
 vdSubmitSuccess(result?: T)                                        | void                 	         | 提交成功回调，可以重写父类方法
 vdSubmitError(err?: any)                                           | void                               | 提价失败回调，可以重写父类方法
 vdValidate($refs?, formName, success, err)                         | void              		 | 表单验证

---

### <a id="VdEditMixin"></a> `VdEditMixin<P, R>` mixin
### 用于编辑页面，加载数据并且提交数据。是VdObjMixin、VdSubmitMixin 混入的结果
```ts
@Component
// @ts-ignore
export class VdEditMixin<T> extends Mixins<VdObjMixin<T>, VdSubmitMixin<T, string>>(
	VdObjMixin,
	VdSubmitMixin,
) {
}
```
