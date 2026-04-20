// 统一管理项目中的用户相关的接口
import request from '@/utils/request'
import type { ArticleData, CommonResponseType } from './types'
// 引入接口的数据类型
// 项目用户相关的请求接口
enum API {
  COLLECT_URL = '/api/collect',
  COLLECT_ARTICLE = '/api/collect/article'
}

export enum CollectType {
  ARTICLE = 0,
  WORD = 1
}

export const reqPostCollect = (data: { itemId: string; type: number }) =>
  request.post<any,CommonResponseType>(API.COLLECT_URL, data)

export const reqDeleteCollect = (itemId:string) =>
  request.delete<any,CommonResponseType>(API.COLLECT_URL,{
    params:{
      itemId
    }
  })

export const reqGetCollectArticle = () =>
  request.get<any,CommonResponseType<ArticleData[]>>(API.COLLECT_ARTICLE)