export interface FeedbackResponse {
  records: Feedback[];
}

export interface FeedbackUser {
  id: string;
  username: string;
  avatar: string | null;
}

export interface Feedback {
  id: string;
  creatorId: string;
  articleId: string;
  parentId: string | null;
  content: string;
  createTime: string;
  updateTime: string;
  deleteFlag: number;
  user: FeedbackUser;
}

export interface FeedbackAddDataType {
  articleId: string;
  content: string;
  parentId?: string | null;
}