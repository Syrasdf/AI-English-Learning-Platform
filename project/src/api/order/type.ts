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

export type orderRequestData = {
  /**
   * 第几页
   */
  pageNum: number
  /**
   * 每页大小
   */
  pageSize: number
  /**
   * 订单状态  null--所有订单  0--待付款订单  1--待发货订单  2--待收货订单  3--待评价订单  4--已完成订单
   */
  state?: string | null
}

export type orderDataType = {
  /**
   * 用户收货地址
   */
  address: string
  /**
   * 订单创建时间
   */
  createTime: string
  /**
   * 商品描述信息
   */
  description: string
  /**
   * 订单id
   */
  id: number
  /**
   * 订单商品图片url地址
   */
  imageUrl: string
  /**
   * 用户收货手机号码
   */
  phone: string
  /**
   * 订单的商品单价
   */
  price: number
  /**
   * 商品id
   */
  productId: number
  /**
   * 订单数量
   */
  quantity: number
  /**
   * 订单状态
   */
  state: number
  /**
   * 订单款式信息
   */
  styleInfo: string
  /**
   * 用户id
   */
  userId: number
  /**
   * 用户名
   */
  username: string
}

export type orderResponseData = ResponseData & {
  data: {
    total: number
    records: orderDataType[]
  }
}
