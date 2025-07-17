import {PageResult,PageQuery} from "../../../base"
/**
 * 查询参数
*/
export interface UdpQuery extends PageQuery {
  /**
   * 关键字()
   */
  keywords?: string;

  /**
   * 故障码()
   */
   fault?: string;

  /**
   * 时间选择的分钟值()
   */
  timeValue?: number;
  
}

/**
 * 分页对象
 */
export interface UdpPageVO {
  /**
   * ID
   */
  id: number;
  /**
   * 数据
   */
  data: string;
  /**
   * 时间
   */
  createTime: Date;
}

/**
 * 字典分页项类型声明
 */
export type UdpPageResult = PageResult<UdpPageVO[]>;