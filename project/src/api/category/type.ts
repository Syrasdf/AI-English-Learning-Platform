// 定义全部接口返回数据都拥有的ts类型
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

export type categoryResponseData = ResponseData & {
  data: categoryItemDataType[]
}

export type categoryItemDataType = {
  /**
   * 分类id
   */
  categoryId?: number
  /**
   * 分类名称
   */
  categoryName: string
  /**
   * 创建时间
   */
  createTime?: string
  /**
   * 详细分类id
   */
  id?: number
  /**
   * 修改时间
   */
  updateTime?: string
}

export type addCategoryItemRequestDataType = {
  /**
   * 分类名称
   */
  categoryName: string
  /**
   * 分类id
   */
  id: number
}

export type updateCategoryItemRequestDataType = {
  /**
   * 修改后的分类名称
   */
  categoryName: string
  /**
   * 详细分类id
   */
  id: number
}
