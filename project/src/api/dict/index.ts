// 统一管理项目中的用户相关的接口
import request from '@/utils/request'
// 引入接口的数据类型
import { DictListResponse, DictResponse, ResponseData } from './type'
// 项目用户相关的请求接口
enum API {
  DICT_URL = '/common/dict',
  DICT_LIST_URL = '/common/dict/list',
}

export const reqAddDict = (word:string)=>request.post<any,DictResponse>(API.DICT_URL,{
  word
})

export const reqDictList = (data:{
  pageSize:number,
  pageNum:number,
  word?:string
})=>request.get<any,DictListResponse>(API.DICT_LIST_URL,{
  params:data
})

export const reqPutDict = (id:string,deleteFlag:number) =>
  request.put<any, ResponseData>(API.DICT_URL, {
    id,
    deleteFlag
  })