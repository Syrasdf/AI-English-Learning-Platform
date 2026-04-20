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

export interface articleResponseDataType extends ResponseData {
  data: {
    records:ArticleData[],
    total:number
  }
}

// 定义对应的 TypeScript 类型
interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  permission: number;
  updateTime: string;
  createTime: string;
}

export interface ArticleData {
  id: string;
  creatorId: string;
  title: string;
  coverImage:string,
  content: string;
  createTime: string;
  updateTime: string;
  views:number;
  feedbackCount:number;
  deleteFlag:number,
  user: User;
}

export type articleAddDataType = {
  title:string;
  content:string;
}