import request from '@/utils/request'

export function getDict(type) {
  return request({
    url: `/api/v1/dict/${type}`,
    method: 'get'
  })
}
