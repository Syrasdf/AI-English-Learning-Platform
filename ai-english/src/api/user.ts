import request from "@/utils/request";
import type { CommonResponseType, UserInfoDataType } from "./types";

const baseURL = '/api';

enum API {
  USER_URL = baseURL + '/user',
  UPLOAD_FILE = baseURL + '/upload',
  HAS_USERNAME_URL = baseURL + '/user/hasName',
}

export const getUserData = ()=>request.get<any,CommonResponseType<UserInfoDataType>>(API.USER_URL)

export const uploadFile = (data:FormData) => request.post<any,CommonResponseType<{url:string}>>(API.UPLOAD_FILE,data,{
  headers: {
    "Content-Type": "multipart/form-data",
  }
})

export const updateUserData = (data:Partial<UserInfoDataType&{password:string}>) => request.put<any,CommonResponseType>(API.USER_URL,data)

export const hasUsername = (username:string) => request.get<any,CommonResponseType<boolean>>(API.HAS_USERNAME_URL,{params:{username}})