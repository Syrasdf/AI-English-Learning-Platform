export type RegisterParamType = {
  username:string,
  email:string,
  code:string
}

export type LoginParamType = {
  username?:string,
  passwrod?:string,
  code?:string,
  email?:string,
  /**
   * 0密码 1验证码
   */
  type:number
}