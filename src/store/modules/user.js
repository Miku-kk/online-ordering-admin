import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { getMenu } from '@/api/menu'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  roles: '',
  menus: '',
  urlType: '',
  rolecode: '',
  userid: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus
  },
  SET_ROLES_CODE: (state, rolecode) => {
    state.rolecode = rolecode
  },
  SET_USER_ID: (state, id) => {
    state.userid = id
  }
}

const actions = {
  // user login
  login({ commit }, loginInfo) {
    return new Promise((resolve, reject) => {
      login(loginInfo).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state, rootState }, obj) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(async response => {
        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const menusData = await getMenu()
        // if (!global.antRouter || global.antRouter.length === 0) {
        //   menusData = await getMenu()
        // }

        const menus = menusData.data

        const { name, avatar, role_id: roles, rolecode, id } = data

        // roles must be a non-empty array
        // if (!roles || roles.length <= 0) {
        //   reject('getInfo: roles must be a non-null array!')
        // }
        commit('SET_USER_ID', id)
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_MENUS', menus)
        commit('SET_ROLES_CODE', rolecode)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_NAME', '')
        commit('SET_ROLES', '')
        commit('SET_MENUS', '')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

