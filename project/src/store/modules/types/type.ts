import { RouteRecordRaw } from 'vue-router'
// 定义小仓库数据state类型
export interface UserState {
  token: null | string
  userMenu: RouteRecordRaw[]
  username: string
  avatar: string
  buttons: string[]
}
