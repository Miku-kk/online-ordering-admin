
const state = {
  game_id: '',
  game_name: '',
  team_id: '',
  team_length: ''
}

const mutations = {
  SetGameId: (state, game_id) => {
    state.game_id = game_id
  },
  SetGameName: (state, game_name) => {
    state.game_name = game_name
  },
  SetTeamId: (state, team_id) => {
    state.team_id = team_id
  },
  SetTeamLength: (state, team_length) => {
    state.team_length = team_length
  }
}

const actions = {
  SetGameId({ commit }, game_id) {
    commit('SetGameId', game_id)
  },
  SetGameName({ commit }, game_name) {
    commit('SetGameName', game_name)
  },
  SetTeamId({ commit }, team_id) {
    commit('SetTeamId', team_id)
  },
  SetTeamLength({ commit }, team_length) {
    commit('SetTeamLength', team_length)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
