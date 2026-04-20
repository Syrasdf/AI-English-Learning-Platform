import request from '@/utils/request'
import { ResponseData } from './type'
enum API {
  GET_TURNOVER = '/admin/order/getTurnover',
}

export const reqTurnoverByDay = (day: number) =>
  request.get<any, ResponseData>(API.GET_TURNOVER, {
    params: {
      day,
    },
  })

export const reqTurnoverPast7Day = async () => {
  const prmoiseList = []
  for (let i = 6; i >= 0; i--) {
    prmoiseList.push(reqTurnoverByDay(i))
  }
  const result = await Promise.all(prmoiseList)
  return result.map((item) => item.data)
}
