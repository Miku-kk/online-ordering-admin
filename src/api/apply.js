import request from '@/utils/request'

export function applyQuery(data) {
  return request({
    url: `/api/apply/query`,
    method: 'post',
    data
  })
}

export function applyUpdate(data) {
  return request({
    url: `/api/apply/update`,
    method: 'post',
    data
  })
}

export function applyDelete(data) {
  return request({
    url: `/api/apply/delete`,
    method: 'post',
    data
  })
}
