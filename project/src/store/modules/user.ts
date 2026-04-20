import { defineStore } from 'pinia'
// 引入用户登录接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
// 引入登录函数的参数类型与返回值类型
import type {
  loginFormData,
  loginResponseData,
  userInfoResponseData,
} from '@/api/user/type.ts'
// 引入数据state的类型
import type { UserState } from './types/type'
// 引入路由数组对象
import { routes } from '@/router/routes'

let useUserStore = defineStore('User', {
  // 数据存储的地方
  state: (): UserState => {
    return {
      token: localStorage.getItem('token'),
      userMenu: routes,
      username: '',
      avatar: '',
      buttons: [],
    }
  },
  // 函数存储的地方
  actions: {
    async userLogin(data: loginFormData) {
      let result: loginResponseData = await reqLogin(data)
      if (result.code === 200) {
        this.token = <string>result.data
        // 将得到的token进行本地存储
        localStorage.setItem('token', <string>result.data)
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },

    // 退出登录
    async userLogOut() {
      let result = await reqLogout()
      if (result.code === 200) {
        this.username = ''
        this.avatar = ''
        this.token = ''
        localStorage.removeItem('token')
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },
  // 计算属性
  getters: {},
})

// 对外暴露
export default useUserStore
