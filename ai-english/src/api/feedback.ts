import request from "@/utils/request";
import type { CommonResponseType } from "./types";
import type { FeedbackAddDataType, FeedbackResponse } from "./types/feedback";

enum API {
  FEEDBACK_GET_URL = "/common/feedback",
  FEEDBACK_POST_URL = "/api/feedback",
}

export const reqGetFeedback = (articleId:string) =>
  request.get<any, CommonResponseType<FeedbackResponse>>(API.FEEDBACK_GET_URL, {
    params: { articleId },
  });

export const reqPostFeedback = (data: FeedbackAddDataType) =>
  request.post<any, CommonResponseType<any>>(API.FEEDBACK_POST_URL, data);