// 统一管理项目中的用户相关的接口
import request from '@/utils/request'
// 引入接口的数据类型
import { FeedbackReponseType, ResponseData } from './type'
// 项目用户相关的请求接口
enum API {
  FEEDBACK_URL = '/api/feedback',
}

export const reqGetFeedback = (data: { pageSize: number; pageNum: number,deleteFlag?:number }) =>
  request.get<any,ResponseData<{
    records:FeedbackReponseType[],
    total:number
  }>>(API.FEEDBACK_URL, {
    params: data,
  })

export const reqPutFeedback = (data: { id: string; deleteFlag: number }) =>
  request.put<any,ResponseData<any>>(API.FEEDBACK_URL, data)
