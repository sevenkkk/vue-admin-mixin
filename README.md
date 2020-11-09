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

- [`VdTable.MainMixin`]
- [`VdTable.ParamMixin`]
- [`VdTable.ListMixin`]
- [`VdListMixin`]
- [`VdObjMixin`]
- [`VdEditMixin`]
- [`VdModal.CrlMixin`]
- [`VdModal.TargetMixin`]
- [`VdModal.CallbackMixin`]


### <a id="VdTable"></a> `VdTable.MainMixin<P, R>` mixin

VdTable.MainMixin Included properties:

 propertie                   | return type         | describe
 --------------------------- | ------------------- | --------------------------
 vdTotal                     | number              | 数据总条数
 vdPage                      | number              | 当前页码
 vdPageSize                  | number              | 每页显示条数
 vdSelected                  | R[]                 | 多选内容
 vdList                      | R[]                 | 数据列表
 vdParams                    | P                   | 请求参数
 vdLLoading                  | boolean             | 是否正在加载
 vdLEmpty                    | boolean             | 是否当前数据为空数据
 vdIndex                     | number              | 当前索引
 vdActive                    | R | undefined       | 当前选中的对象 （Only get is supported）
 vdIsDefaultSet              | boolean             | 请求结果是否直接赋值给 vdList

---

VdTable.MainMixin Included method:

 method                      | return type          	           	         | describe
 --------------------------- | ------------------------------------------------- | --------------------------
 vdUsePage                   | boolean                                           | 是否使用分页 （Only get is supported）
 vdInitData                  | Promise<UseResult<R[]>>                           | 初始化数据（vdPage = 1）
 vdRefresh                   | Promise<UseResult<R[]>>                           | 刷新数据（页码不变）
 vdRefreshByPage             | void                 				 | 根据分页参数变化,重新加载数据
 vdDefaultParams             | P                 				 | 设置默认参数
 vdSetListPath               | void                 				 | 设置请求参数，vdInitData 时会自动设置到全局变量上

---

VdTable.ParamMixin Included properties:

 propertie                   | return type         | describe
 --------------------------- | ------------------- | --------------------------
 vdParams                    | number              | 列表请求参数(同步 VdTable.MainMixin里的vdParams)

---

VdTable.ParamMixin Included method:

 method                      | return type          	           	         | describe
 --------------------------- | ------------------------------------------------- | --------------------------
 vdSearch                    | void                                              | 查询数据（实际上调用的是 VdTable.MainMixin里的vdInitData方法）
 vdRefresh                   | void                                              | 刷新数据（实际上调用的是 VdTable.MainMixin里的vdRefresh方法）

---

VdTable.ListMixin Included properties:

 propertie                   | return type         | describe
 --------------------------- | ------------------- | --------------------------
 vdList                      | Array<T>            | 列表请求返回值(同步 VdTable.MainMixin里的vdList)

---

VdTable.ParamMixin Included method:

 method                      | return type          	           	         | describe
 --------------------------- | ------------------------------------------------- | --------------------------
 vdSearch                    | void                                              | 查询数据（实际上调用的是 VdTable.MainMixin里的vdInitData方法）
 vdRefresh                   | void                                              | 刷新数据（实际上调用的是 VdTable.MainMixin里的vdRefresh方法）

---

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

**Note that:**

## If the search criteria area is a component, in this case the component < PlatformListSearch >, we can use the【 VdTable.ParamMixin 】To synchronize data.

```html
<el-form :inline="true" :model="vdParams" class="demo-form-inline">
  <el-form-item label="筛选">
    <el-input v-model="vdParams.searchText" placeholder="请输入筛选条件" />
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="vdSearch">搜索</el-button>
    <el-button @click="vdClear">清空</el-button>
  </el-form-item>
</el-form>
```

```ts
import { Component } from 'vue-property-decorator';
import { VdTable } from 'vue-admin-mixin';

@Component
export default class PlatformListSearch extends VdTable.ParamMixin<PlatformSearch> {
}
```

## If the table is a component, in this case the component < PlatformListTable >, we can use the【 VdTable.ListMixin 】To synchronize data.

```html
<el-table :data="vdList" stripe>
  <el-table-column prop="name" label="XXX" width="168">
  </el-table-column>
  <div slot="vdTEmpty">
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
