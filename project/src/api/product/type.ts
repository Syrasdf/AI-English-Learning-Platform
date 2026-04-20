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

export type productRequestDataType = {
  /**
   * 关键词  为null搜索全部
   */
  keyWord?: string | null
  /**
   * 第几页
   */
  pageNum?: number
  /**
   * 每页大小
   */
  pageSize?: number
  /**
   * 商品上架状态  0--上架  1--下架  null--全部
   */
  state?: number | null
}

export type productDataType = {
  /**
   * 创建时间
   */
  createTime: string
  description: string
  /**
   * 商品id
   */
  id: number
  /**
   * 商品图片地址url
   */
  imageUrl: string
  /**
   * 单价
   */
  price: number
  /**
   * 商品状态  0--上架  1--下架
   */
  state: number
  /**
   * 库存
   */
  stockQuantity: number
  /**
   * 款式名称
   */
  styleItemName: Array<string[]>
  /**
   * 款式分类名称
   */
  styleName: string[]
}

export type productInfoResponseData = ResponseData & {
  data: {
    total: number
    records: productDataType[]
  }
}

export type addProductRequestDataType = {
  id: number
  name: string
  description: string
  price: number
  stockQuantity: number
  imageUrl: any[] | null
}

export type AddProductStyleRequestDataType = {
  /**
   * 商品id
   */
  id: number
  /**
   * 商品款式信息
   */
  styleItem: Array<StyleItem[]>
  /**
   * 商品款式分类名
   */
  styleName: string[]
  [property: string]: any
}

export type StyleItem = {
  /**
   * 当前商品分类添加的价格
   */
  price: number
  /**
   * 商品分类名称
   */
  styleItemName: string
}
