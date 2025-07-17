import {PageResult,PageQuery} from "../../base"

/**
 * 设备查询对象类型
 */
export interface IotDeviceQuery extends PageQuery {
  keywords?: string;
  status?: number;
  Id?: number;
  fault?: number;
}

/**
 * 用户分页对象
 */
export interface IotDevicePageVO {

  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 更新时间
   */
  updateTime?: Date;
  /**
   * 产品名称
   */
  Name?: string;
  /**
   * 设备ID
   */
  id?: number;
  /**
   * 在线状态(1:在线;0:离线)
   */
  status?: number;
  /**
   * 车辆编号
   */
  Num?:number
  /**
   * 数据源
   */
  dataSource?: number;
  /**
   * 设备名称
   */
  deviceName?: string;
  /**
   * 设备故障码
   */
  fault?: number;
}

/**
 * 字典分页项类型声明
 */
export type IotDevicePageResult = PageResult<IotDevicePageVO[]>;