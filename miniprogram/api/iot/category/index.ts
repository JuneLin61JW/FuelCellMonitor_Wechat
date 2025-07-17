import { httpRequest } from '../../../utils/request'
const baseUrl = require('../../base').allBaseUrl.Envs.host
import { IotCategoryQuery, IotCategoryPageResult } from './types'

/**
 * 获取设备分页列表
 *
 * @param queryParams
 */
export function getIotCategoryPage(queryParams:IotCategoryQuery) {
  return httpRequest.get<IotCategoryPageResult>(
    baseUrl + '/iot/category/page',
    queryParams,
  );
}