import request from '@/utils/request'
const md5 = require('blueimp-md5')

export function login(data) {
  const username = data.username
  const password = md5(data.password)

  return request({
    url: '/api/v1/login/web',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/api/v1/user/info',
    method: 'post'
    // params: { token }
  })
}

export function logout() {
  return request({
    url: '/api/v1/logout',
    method: 'post'
  })
}

export function queryPage(data) {
  return request({
    url: '/api/v1/user/list',
    method: 'post',
    data
  })
}

export function createUser(data) {
  return request({
    url: '/api/v1/user/create',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/api/v1/user/update',
    method: 'post',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: '/api/v1/user/delete',
    method: 'post',
    data
  })
}

export function getCurUser() {
  return request({
    url: '/api/cur/user',
    method: 'get'
  })
}

export function changePsw(data) {
  const oldPass = md5(data.oldPass)
  const pass = md5(data.pass)

  return request({
    url: '/api/v1/user/change/psw',
    method: 'post',
    data: {
      oldPass,
      pass
    }
  })
}

export function resetPsw(data) {
  return request({
    url: '/api/v1/user/reset/psw',
    method: 'post',
    data
  })
}
