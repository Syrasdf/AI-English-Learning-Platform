// 统一管理项目中的用户相关的接口
import request from '@/utils/request'
// 引入接口的数据类型
import type { articleAddDataType, ArticleListResponse } from './types/article'
import type { CommonResponseType } from './types'
// 项目用户相关的请求接口
enum API {
  ARTICLE_URL = '/common/article',
  ARTICLE_VIEW_ADD_URL = '/common/article/views',
}

export const reqPostArticle = (data: articleAddDataType) =>
  request.post<any,CommonResponseType<any>>(API.ARTICLE_URL, data)

export const reqGetArticle = (data?: any) =>
  request.get<any, CommonResponseType<ArticleListResponse>>(API.ARTICLE_URL, { params: data })

export const reqPutArticle = (id:string,deleteFlag:number) =>
  request.put<any, CommonResponseType<any>>(API.ARTICLE_URL, {
    id,
    deleteFlag
  })

export const reqAddArticleView = (id:string) =>
  request.post<any, CommonResponseType<any>>(API.ARTICLE_VIEW_ADD_URL, {
    id
  })