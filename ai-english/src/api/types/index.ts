export type CommonResponseType<T = any> = {
  code:number,
  message?:string,
  data?:T
}

export * from './dialog'
export * from './login'
export * from './article'
export * from './dict'
export * from './feedback'
export * from './user'
