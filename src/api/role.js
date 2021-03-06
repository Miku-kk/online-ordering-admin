import request from '@/utils/request'

export function roleQuery(data) {
  return request({
    url: `/api/v1/role/query`,
    method: 'post',
    data
  })
}

// export function getSysRole(data) {
//   return request({
//     url: `/api/role/get`,
//     method: 'post',
//     data
//   })
// }

export function typeCreate(data) {
  return request({
    url: `/api/v1/role/create`,
    method: 'post',
    data
  })
}

export function typeUpdate(data) {
  return request({
    url: `/api/v1/role/update`,
    method: 'post',
    data
  })
}

export function typeDelete(data) {
  return request({
    url: `/api/v1/role/delete`,
    method: 'post',
    data
  })
}
