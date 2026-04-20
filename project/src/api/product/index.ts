import request from '@/utils/request'
import {
  AddProductStyleRequestDataType,
  productInfoResponseData,
  productRequestDataType,
  ResponseData,
} from './type'

enum API {
  GET_PRODUCT = '/admin/product/getProduct',
  PUTAWAY = '/admin/product/putaway',
  SOLDOUT = '/admin/product/soldout',
  ADD_PRODUCT = '/admin/product/addProduct',
  ADD_PRODUCT_STYLE = '/admin/product/addProductStyle',
  UPDATE_PRODUCT = '/admin/product/updateProduct',
}

export const reqProduct = (data: productRequestDataType) =>
  request.get<any, productInfoResponseData>(API.GET_PRODUCT, { params: data })

export const reqPutAway = (id: number) =>
  request.put<any, ResponseData>(
    API.PUTAWAY,
    {},
    {
      params: {
        id,
      },
    },
  )

export const reqSoldOut = (id: number) =>
  request.put<any, ResponseData>(
    API.SOLDOUT,
    {},
    {
      params: {
        id,
      },
    },
  )

export const reqAddProudct = (data: FormData) =>
  request.post<any, ResponseData>(API.ADD_PRODUCT, data, {
    headers: {
      'Content-Type': 'multipart/form-data;',
    },
  })

export const reqAddProudctStyle = (data: AddProductStyleRequestDataType) =>
  request.post<any, ResponseData>(API.ADD_PRODUCT_STYLE, data)

export const reqUpdateProduct = (data: FormData) =>
  request.put<any, ResponseData>(API.UPDATE_PRODUCT, data, {
    headers: {
      'Content-Type': 'multipart/form-data;',
    },
  })
