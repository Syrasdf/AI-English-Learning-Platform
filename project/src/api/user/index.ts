// 统一管理项目中的用户相关的接口
import request from '@/utils/request'
// 引入接口的数据类型
import type {
  loginFormData,
  loginResponseData,
  userInfoResponseData,
} from './type'
// 项目用户相关的请求接口
enum API {
  LOGIN_URL = '/common/login',
  USERINFO_URL = '/api/admin/user/getUserInfo',
  LOGOUT_URL = '/user/user/logout',
}

// 登录接口
export const reqLogin = (data: loginFormData) =>
  request.post<any, loginResponseData>(API.LOGIN_URL, {...data,type:0})
// 获取用户信息接口
export const reqUserInfo = () =>
  request.get<any, userInfoResponseData>(API.USERINFO_URL)
// 退出登录接口
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)
