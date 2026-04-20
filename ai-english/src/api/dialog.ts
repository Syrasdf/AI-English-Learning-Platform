import request from '@/utils/request'
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs'
import type { CommonResponseType, DialogHistroyByIdResponseType, DialogHistroyResponseType, Text2SpeechResponseType } from './types'
import { userStore } from '@/store'

const baseURL = '/api'

enum API {
  DIALOG_URL = baseURL + '/dialog',
  DIALOG_VOICE_URL = baseURL + '/voice-dialog',
  NEW_DIALOG_URL = baseURL + '/new-dialog',
  DIALOG_HISTORY_URL = baseURL + '/user-dialog-history',
  GET_DIALOG_HISTORY_BY_ID = baseURL + '/dialog-history',
  TEXT_2_SPEECH = baseURL + '/text2speech',
  CONTENT_ANALYSIS = baseURL + '/content-analysis',
  GEN_REPORT = baseURL + '/gen-report',
}

export const getDialogContent = (data: {
  dialogId:string,
  message:ChatCompletionMessageParam[]
}) =>
  fetch('/api' + API.DIALOG_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json','Authorization':'Bearer '+userStore.token },
    body: JSON.stringify(data)
  })

export const getDialogVoiceContent = (data: ChatCompletionMessageParam[]) =>
  request.post<any, CommonResponseType>(API.DIALOG_VOICE_URL, data)

export const getNewDialogId = ()=>request.get<any,CommonResponseType<string>>(API.NEW_DIALOG_URL)

export const getDialogHistroy = ()=>request.get<any,CommonResponseType<DialogHistroyResponseType>>(API.DIALOG_HISTORY_URL)

export const getDialogHistroyById = (dialogId:string)=>request.get<any,CommonResponseType<DialogHistroyByIdResponseType>>(API.GET_DIALOG_HISTORY_BY_ID,{
  params:{
    dialogId
  }
})

export const getSpeechByText = (text:string)=>request.post<any,CommonResponseType<Text2SpeechResponseType>>(API.TEXT_2_SPEECH,{
  message:text
})

export const getContentAnalysis = (message:string) =>
  fetch('/api' + API.CONTENT_ANALYSIS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json','Authorization':'Bearer '+userStore.token },
    body: JSON.stringify({
      message
    })
  })

export const getReport = (id:string) =>
  fetch('/api' + API.GEN_REPORT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json','Authorization':'Bearer '+userStore.token },
    body: JSON.stringify({
      id
    })
  })