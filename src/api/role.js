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

export function createdSysRole(data) {
  return request({
    url: `/api/v1/role/create`,
    method: 'post',
    data
  })
}

export function updateSysRole(data) {
  return request({
    url: `/api/v1/role/update`,
    method: 'post',
    data
  })
}

export function deleteSysRole(data) {
  return request({
    url: `/api/v1/role/delete`,
    method: 'post',
    data
  })
}
