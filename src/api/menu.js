import request from '@/utils/request'

export function getMenu(data) {
  return request({
    url: `/api/v1/menu`,
    method: 'post',
    data
  })
}

export function getMenuAll() {
  return request({
    url: `/api/v1/menu/all`,
    method: 'post'
  })
}

export function getRoleMenu(data) {
  return request({
    url: `/api/v1/menu/role`,
    method: 'post',
    data
  })
}

export function setRoleMenu(data) {
  return request({
    url: `/api/v1/menu/set`,
    method: 'post',
    data
  })
}
