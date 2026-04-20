export interface ResponseData {
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

export interface Example {
  id: number
  text: string
  translation: string
}

export interface Definition {
  id: number
  pos: string
  text: string
  example: Example[]
  translation: string
}

export interface Verb {
  id: number
  text: string
  type: string
}

export interface Pronunciation {
  pos: string
  url: string
  lang: string
  pron: string
}

export interface Dict {
  pos: string[]
  word: string
  verbs: Verb[]
  definition: Definition[]
  pronunciation: Pronunciation[]
}

export interface DictResponse extends ResponseData {
  data: {
    id: string
    word: string
    dict: Dict
  }
}

export interface WordDictType {
  deleteFlag: number | null
  id: string
  word: string
  dict: Dict
}

export interface DictListResponse extends ResponseData {
  data: {
    records: WordDictType[]
    total: number
  }
}
