import request from '@/utils/request'
import { orderRequestData, orderResponseData, ResponseData } from './type'

enum API {
  GET_ORDER = '/admin/order/getOrder',
  DELIVER_GOODS = '/admin/order/put',
}

export const reqOrder = (data: orderRequestData) =>
  request.get<any, orderResponseData>(API.GET_ORDER, {
    params: data,
  })

export const reqDeliver = (id: number) =>
  request.put<any, ResponseData>(
    API.DELIVER_GOODS,
    {},
    {
      params: {
        id,
      },
    },
  )
