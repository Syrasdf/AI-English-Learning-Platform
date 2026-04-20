import request from "@/utils/request";
import type { CommonResponseType } from "./types";
import type { DictResponse } from "./types/dict";

const baseURL = '/common';

enum API {
  DICT_URL = baseURL + '/dict'
}

export const getDictData = (query: { word: string }) =>
  request.get<any, CommonResponseType<DictResponse>>(API.DICT_URL, {
    params: query
  });