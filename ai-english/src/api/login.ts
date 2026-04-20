import request from "@/utils/request";
import type { CommonResponseType, LoginParamType, RegisterParamType } from "./types";

const baseURL = '/common'

enum API {
  SEND_CODE = baseURL+'/genCode',
  REGISTER = baseURL+'/register',
  LOGIN = baseURL+'/login'
}

export const getVerifyCode = (email:string)=>request.post<any,CommonResponseType>(API.SEND_CODE,{
  email
})

export const postUserRegister = (data:RegisterParamType)=>request.post<any,CommonResponseType<string>>(API.REGISTER,data)

export const postUserLogin = (data:LoginParamType)=>request.post<any,CommonResponseType<string>>(API.LOGIN,data)