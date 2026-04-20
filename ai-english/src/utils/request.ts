import axios from "axios";
import {message as AntdMessage} from 'ant-design-vue'
import { initAllData, userStore } from "@/store";
import router from "@/router";

const request = axios.create({
  baseURL:'/api',
})

request.interceptors.request.use((req)=>{
  req.headers.Authorization = 'Bearer '+userStore.token
  return req
})

request.interceptors.response.use((response)=>{
  if(response.data.code===401){
    initAllData()
    router.push({
      name:'主页',
    })
    AntdMessage.error('登录过期',3)
  }
  // 请求成功时的回调
  return response.data
},(error)=>{
  // 请求失败时的回调
  let message = ''
  let status = error.response?.code
  switch(status){
    case 401:
      message = 'TOKEN过期'
      initAllData()
      router.push('/home')
      break
    case 403:
      message = '无权访问'
      break
    case 404:
      message = '地址错误'
      break
    case 500:
      message = '服务器异常'
      break
    default:
      message = '网络异常'
      break
  }

  AntdMessage.error(message,3)

  return  Promise.reject(error)
})

export default request