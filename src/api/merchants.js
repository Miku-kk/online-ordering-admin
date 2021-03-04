import request from '@/utils/request'

export function merchantsQueryAll(data) {
  return request({
    url: `/api/merchantInfo/queryAll`,
    method: 'post',
    data
  })
}
export function merchantsUpdate(data) {
  return request({
    url: `/api/merchantInfo/update`,
    method: 'post',
    data
  })
}
