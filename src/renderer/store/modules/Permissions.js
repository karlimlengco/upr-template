import PermissionResource from '../../api/permissions'
import PermissionSQLite from '../../sqlite/permissions'
import { db } from '../../../server/db.js'



const state = {
  permissions: []
}

const mutations = {
  PERMISSION_SQLLIST (state, permissions) {
    state.permissions = permissions
  },
  PERMISSION_LIST (state, permissions) {
    state.permissions = permissions
  },
  PERMISSION_LIST2 (state, permissions) {
    state.permissions = permissions
  },
  PERMISSION_SQLCreate (state, permission) {
    // state.permissions.push(permission)
  },
  PERMISSION_SQLSync (state, permission) {
    // state.permissions.push(permission)
  },
  PERMISSION_SQLPush (state, permission) {
    // state.permissions.push(permission)
  }
}

const actions = {
  listPermissions ({ commit }, page = 1) {
    // commit('PERMISSION_SQLLIST', PermissionSQLite.getAll(page))
    var data = {}
    db.serialize(function () {
      db.all('select * from permissions limit 20 offset ' + page, function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('PERMISSION_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('PERMISSION_SQLLIST', data)
      })
    })
  },
  dropdownPermissions ({ commit }, page = 1) {
    // commit('PERMISSION_SQLLIST', PermissionSQLite.getAll(page))
    db.serialize(function () {
      db.all('select * from permissions', function (err, allRows) {
        if (err != null) {
          commit('PERMISSION_SQLLIST', err)
        }
        commit('PERMISSION_LIST2', allRows)
      })
    })
  },
  createPermission ({ commit }, permission) {
    commit('PERMISSION_SQLCreate', PermissionSQLite.save(permission))
  },
  syncPermissions ({ commit }, permissions) {
    PermissionResource.all().then(response => {
      commit('PERMISSION_SQLSync', PermissionSQLite.syncNew(response.data.data))
    })
  },
  serverPermissionPush ({ commit }) {
    // commit('PERMISSION_SQLPush', PermissionSQLite.serverPush(PermissionSQLite.getNew()))
    db.serialize(function () {
      db.all('select * from permissions where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('PERMISSION_SQLPush', err)
        }
        PermissionResource.serverPush(allRows)
        commit('PERMISSION_SQLPush', allRows)
      })
    })
  },
  getPermissions ({ commit }, page = 1) {
    PermissionResource.all(page).then(response => {
      commit('PERMISSION_LIST', response.data.data)
    })
  }
}

// getters are functions
const getters = {
  permissions: state => state.permissions
}

export default {
  state,
  getters,
  mutations,
  actions
}
