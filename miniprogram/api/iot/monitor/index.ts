import { httpRequest } from '../../../utils/request'
const baseUrl = require('../../base').allBaseUrl.Envs.host
import { IotDeviceStatus } from './types'

/**
 * 获取设备分页列表
 *
 * @param queryParams
 */
export function getIotDeviceStatus(keyword: string) {
  return httpRequest.get<IotDeviceStatus>(
    baseUrl + '/iot/device/status',
    {
      keyword: keyword
    },

  )
}