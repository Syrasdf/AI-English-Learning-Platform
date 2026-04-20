import request from '@/utils/request'
import {
  addCategoryItemRequestDataType,
  categoryResponseData,
  ResponseData,
  updateCategoryItemRequestDataType,
} from './type'

enum API {
  GET_CATEGORY = '/admin/category/getCategoryItems/',
  ADD_CATEGORY_ITEM = '/admin/category/addCategoryItem',
  DEL_CATEGORY_ITEM = '/admin/category/delete',
  UPDATE_CATEGORY_ITEM = '/admin/category/update',
}

export const reqCategory = async () => {
  const prmoiseList = []
  for (let i = 1; i <= 10; i++) {
    prmoiseList.push(
      request.get<any, categoryResponseData>(API.GET_CATEGORY + i),
    )
  }
  try {
    const result = await Promise.all(prmoiseList)
    return result.map((item) => item.data)
  } catch {}
}

export const reqAddCategoryItem = (data: addCategoryItemRequestDataType) =>
  request.post<any, ResponseData>(API.ADD_CATEGORY_ITEM, data)

export const reqDelCategoryItem = (id: number, categoryName: string) =>
  request.delete<any, ResponseData>(API.DEL_CATEGORY_ITEM, {
    params: { id, categoryName },
  })

export const reqUpdateCategoryItem = (
  data: updateCategoryItemRequestDataType,
) => request.put<any, ResponseData>(API.UPDATE_CATEGORY_ITEM, data)
