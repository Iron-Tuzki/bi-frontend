// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** countUnread GET /api/notification/countUnread */
export async function countUnreadUsingGET(options?: { [key: string]: any }) {
  return request<API.BaseResponseInt_>('/api/notification/countUnread', {
    method: 'GET',
    ...(options || {}),
  });
}

/** getAllUnread GET /api/notification/getUnread */
export async function getAllUnreadUsingGET(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAllUnreadUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageUserNotification_>('/api/notification/getUnread', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** changeStatus GET /api/notification/read */
export async function changeStatusUsingGET(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.changeStatusUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/notification/read', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
