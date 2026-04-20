export interface ResponseData<T extends unknown> {
  /**
   * 业务状态码
   */
  code: number
  /**
   * 响应数据
   */
  data?: T
  /**
   * 提示信息
   */
  message: string
}

export type FeedbackReponseType = {
  article: {
      title: string;
  };
  user: {
      id: string;
      username: string;
      avatar: string | null;
  };
} & {
  id: string;
  creatorId: string;
  articleId: string;
  parentId: string | null;
  content: string | null;
  createTime: Date | null;
  updateTime: Date | null;
  deleteFlag: number | null;
}