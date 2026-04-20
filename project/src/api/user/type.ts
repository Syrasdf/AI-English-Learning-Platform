// 定义用户相关数据的ts类型

// 用户登录接口携带参数的ts类型
export interface loginFormData {
  username: string
  password: string
}

// 定义全部接口返回数据都拥有的ts类型
interface ResponseData {
  /**
   * 业务状态码
   */
  code: number
  /**
   * 响应数据
   */
  data?: unknown
  /**
   * 提示信息
   */
  message: string
}

// 定义登录接口返回的数据类型
export interface loginResponseData extends ResponseData {
  data: string
}

// 定义获取用户信息接口返回的数据类型
export interface userInfoResponseData extends ResponseData {
  data: userInfoData[]
}

export type userInfoData = {
  /**
   * 创建时间
   */
  createTime?: string
  /**
   * 邮箱
   */
  email: string
  /**
   * 用户id，ID 编号
   */
  id: number
  /**
   * 密码
   */
  password: string
  /**
   * 电话号码
   */
  phone: string
  /**
   * 修改时间
   */
  updateTime?: string
  /**
   * 用户头像地址
   */
  userAvatarUrl: string
  /**
   * 用户名
   */
  username: string
}
