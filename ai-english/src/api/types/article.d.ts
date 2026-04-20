export interface ArticleListResponse {
  records:ArticleData[],
  total:number
}

// 定义对应的 TypeScript 类型
interface User {
  id: string;
  username: string;
  avatar:string;
  email: string;
  phone: string;
  updateTime: string;
  createTime: string;
}

export interface ArticleData {
  id: string;
  creatorId: string;
  title: string;
  coverImage:string,
  content: string;
  rawContent?:string;
  createTime: string;
  updateTime: string;
  views:number;
  feedbackCount:number;
  deleteFlag:number,
  user: User;
  isCollect?:boolean
}

export type articleAddDataType = {
  title:string;
  content:string;
}