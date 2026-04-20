import request from '@/utils/request'
import type { CommonResponseType } from './types'
import { userStore } from '@/store'

const baseURL = '/common'

enum API {
  NORMAL_TRANSLATE = baseURL + '/translate/normal',
  LLM_TRANSLATE = baseURL + '/translate/llm'
}

export const getNormalTranslate = (
  word: string,
  from: string,
  to: string,
  domain: string
) =>
  request.post<any, CommonResponseType<NormalTranslateReponseType>>(
    API.NORMAL_TRANSLATE,
    {
      word,
      from,
      to,
      domain
    }
  )

/**
 * https://ai.youdao.com/DOCSIRMA/html/trans/api/dmxfy/index.html
 * @param word
 * @param from
 * @param to
 * @returns
 */
export const getLLMTranslate = (
  word: string
  // from: string,
  // to: string,
  // handleOption: number,
  // polishOption: number,
  // expandOption: number
) =>
  fetch('/api'+API.LLM_TRANSLATE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + userStore.token
    },
    body: JSON.stringify({
      word
    })
  })
