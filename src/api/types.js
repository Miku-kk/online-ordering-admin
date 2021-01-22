import request from '@/utils/request'

export function typesQuery(data) {
  return request({
    url: `/api/types/query`,
    method: 'post',
    data
  })
}

export function typeCreate(data) {
  return request({
    url: `/api/types/create`,
    method: 'post',
    data
  })
}

export function typeUpdate(data) {
  return request({
    url: `/api/types/update`,
    method: 'post',
    data
  })
}

export function typeDelete(data) {
  return request({
    url: `/api/types/delete`,
    method: 'post',
    data
  })
}
