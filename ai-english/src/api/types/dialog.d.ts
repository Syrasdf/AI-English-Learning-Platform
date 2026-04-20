import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs'

export type DialogHistroyResponseType = {
  dialogId:string,
  dialogHistory:string,
  createTime:number
}[]

export type DialogHistroyByIdResponseType = {
  dialogId:string,
  dialogContent:ChatCompletionMessageParam[],
}

export type Text2SpeechResponseType = {
  url:string
  records:string
}