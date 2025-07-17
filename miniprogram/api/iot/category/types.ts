import {PageResult,PageQuery} from "../../base"

/**
 * 设备查询对象类型
 */
export interface IotCategoryQuery extends PageQuery {
  keywords?: string;
}

/**
 * 用户分页对象
 */
export interface IotCategoryPageVO {

  /**
   * 产品ID
   */
  id?: number;
  /**
   * 产品名称
   */
  name?: string;
  /**
   * 产品数据源
   */
  dataSourceLabel?: string;
  /**
   * 创建时间
   */
  creatTime?: Date;
  /**
   * 产品描述
   */
  remark?:string;
}

/**
 * 字典分页项类型声明
 */
export type IotCategoryPageResult = PageResult<IotCategoryPageVO[]>;