import { httpRequest } from '../../../../utils/request'
const baseUrl = require('../../../base').allBaseUrl.Envs.host
import { UdpQuery, UdpPageResult } from './types'

/**
 * Iot分页列表
 *
 * @param queryParams
 */
export function getUdpPage(queryParams: UdpQuery) {
  return httpRequest.get<UdpPageResult>(
    baseUrl + '/iot/devlog_hh/page',
    queryParams,
  ); 
}