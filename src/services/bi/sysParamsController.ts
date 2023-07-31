// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** getParams GET /api/sysParams/getParams */
export async function getParamsUsingGET(options?: { [key: string]: any }) {
  return request<API.BaseResponseMapStringBoolean_>('/api/sysParams/getParams', {
    method: 'GET',
    ...(options || {}),
  });
}

/** switchStatus GET /api/sysParams/switchStatus */
export async function switchStatusUsingGET(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.switchStatusUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/sysParams/switchStatus', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
