import { httpRequest } from '../../../utils/request'
const baseUrl = require('../../base').allBaseUrl.Envs.host
import { IotDeviceQuery, IotDevicePageResult } from './types'

/**
 * 获取设备分页列表
 *
 * @param queryParams
 */
export function getIotDevicePage(queryParams:IotDeviceQuery) {
  return httpRequest.get<IotDevicePageResult>(
    baseUrl + '/iot/device/page',
    queryParams,
  );
}