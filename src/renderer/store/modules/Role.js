import RoleResource from '../../api/roles'
import RoleSQLite from '../../sqlite/roles'
import { db } from '../../../server/db.js'



const state = {
  roles: []
}

const mutations = {
  ROLE_SQLLIST (state, roles) {
    state.roles = roles
  },
  ROLE_LIST (state, roles) {
    state.roles = roles
  },
  ROLE_LIST2 (state, roles) {
    state.roles = roles
  },
  ROLE_SQLCreate (state, role) {
    // state.roles.push(role)
  },
  ROLE_SQLSync (state, role) {
    // state.roles.push(role)
  },
  ROLE_SQLPush (state, role) {
    // state.roles.push(role)
  }
}

const actions = {
  listRoles ({ commit }, page = 1) {
    // commit('ROLE_SQLLIST', RoleSQLite.getAll(page))
    var data = {}
    db.serialize(function () {
      db.all('select * from roles limit 20 offset ' + page, function (err, allRows) {
        if (err != null) {
          commit('ROLE_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('ROLE_SQLLIST', data)
      })
    })
  },
  dropdownRoles ({ commit }, page = 1) {
    // commit('ROLE_SQLLIST', RoleSQLite.getAll(page))
    db.serialize(function () {
      db.all('select * from roles', function (err, allRows) {
        if (err != null) {
          commit('ROLE_SQLLIST', err)
        }
        commit('ROLE_LIST2', allRows)
      })
    })
  },
  createRole ({ commit }, role) {
    commit('ROLE_SQLCreate', RoleSQLite.save(role))
  },
  syncRoles ({ commit }, roles) {
    RoleResource.all().then(response => {
      commit('ROLE_SQLSync', RoleSQLite.syncNew(response.data.data))
    })
  },
  serverRolePush ({ commit }) {
    // commit('ROLE_SQLPush', RoleSQLite.serverPush(RoleSQLite.getNew()))
    db.serialize(function () {
      db.all('select * from roles where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('ROLE_SQLPush', err)
        }
        RoleResource.serverPush(allRows)
        commit('ROLE_SQLPush', allRows)
      })
    })
  },
  getRoles ({ commit }, page = 1) {
    RoleResource.all(page).then(response => {
      commit('ROLE_LIST', response.data.data)
    })
  }
}

// getters are functions
const getters = {
  roles: state => state.roles
}

export default {
  state,
  getters,
  mutations,
  actions
}
