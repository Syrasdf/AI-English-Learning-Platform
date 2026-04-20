// 统一管理项目中的用户相关的接口
import request from '@/utils/request'
// 引入接口的数据类型
import type { articleAddDataType, articleResponseDataType, ResponseData } from './type'
// 项目用户相关的请求接口
enum API {
  ARTICLE_URL = '/common/article',
}

export const reqPostArticle = (data: articleAddDataType) =>
  request.post<any, ResponseData>(API.ARTICLE_URL, data)

export const reqGetArticle = (data?: any) =>
  request.get<any, articleResponseDataType>(API.ARTICLE_URL, { params: data })

export const reqPutArticle = (id:string,deleteFlag:number) =>
  request.put<any, ResponseData>(API.ARTICLE_URL, {
    id,
    deleteFlag
  })