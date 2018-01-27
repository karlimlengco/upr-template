import UserResource from '../../api/user'
import UserSQLite from '../../sqlite/user'
import { db } from '../../../server/db.js'

const state = {
  users: [],
  currentUser: [],
  userPermissions: [],
  userRoles: []
}

const mutations = {
  USER_SQLLIST (state, users) {
    state.users = users
  },
  USER_ONLY_SQLLIST (state, currentUser) {
    state.currentUser = currentUser
  },
  USER_LIST (state, users) {
    state.users = users
  },
  USER_Permissions (state, userPermissions) {
    state.userPermissions = userPermissions
  },
  USER_ROLE_LIST (state, roles) {
    state.userRoles = roles
  },
  USER_SQLCreate (state, user) {
    // state.users.push(user)
  },
  USER_SQLSync (state, user) {
    // state.users.push(user)
  },
  USER_SQLPush (state, user) {
    // state.users.push(user)
  }
}

const actions = {
  listUsers ({ commit }, [page = 0, q = ""]) {
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select users.*, catered_units.short_code as unit from users LEFT JOIN catered_units ON users.unit_id = catered_units.id WHERE users.first_name LIKE ?1 OR users.middle_name LIKE ?1 OR users.surname LIKE ?1  OR users.email LIKE ?1 OR users.username LIKE ?1  LIMIT 20 OFFSET '+ page, {1: query}, function (err, allRows) {
        if (err != null) {
          console.log(err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('USER_SQLLIST', data)
      })
    })
  },
  createUser ({ commit }, user) {
    commit('USER_SQLCreate', UserSQLite.save(user))
  },
  syncUsers ({ commit }, users) {
    commit('USER_SQLSync', UserSQLite.syncNew(users))
  },
  syncUserRoles ({ commit }, roles) {
    UserResource.allUserRole().then(response => {
      UserSQLite.syncNewRole(response.data.data)
    })
  },
  getUserById ({ commit }, id) {
    db.serialize(function () {
      db.get('select * from users where id=?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('USER_SQLLIST', err)
        }
        commit('USER_SQLLIST', allRows)
      })
    })
  },
  getCurrentUser ({ commit }, id) {
    db.serialize(function () {
      db.get('select * from users where id=?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('USER_ONLY_SQLLIST', err)
        }
        commit('USER_ONLY_SQLLIST', allRows)
      })
    })
  },
  getUserPermission ({ commit }, id) {
    db.serialize(function () {
      db.all('select roles.permissions from users LEFT JOIN role_users ON users.id = role_users.user_id LEFT JOIN roles ON roles.id = role_users.role_id WHERE users.id=?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('USER_Permissions', err)
        }
        commit('USER_Permissions', allRows)
      })
    })
  },
  updateUser ({ commit }, [id, model]) {
    commit('USER_SQLCreate', UserSQLite.update(id, model))
  },
  updateUserRole ({ commit }, model) {
    commit('USER_SQLCreate', UserSQLite.updateRoleUser(model) )
  },
  getRoleByUser ({ commit }, id) {
    db.serialize(function () {
      db.all('select roles.id from role_users LEFT JOIN roles ON roles.id = role_users.role_id where role_users.user_id=?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('USER_ROLE_LIST', err)
        }
        commit('USER_ROLE_LIST', allRows)
      })
    })
  },
  serverUserPush ({ commit }) {
    // commit('USER_SQLPush', UserSQLite.serverPush(UserSQLite.getNew()))
    db.serialize(function () {
      db.all('select * from users where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('USER_SQLPush', err)
        }
        UserResource.serverPush(allRows)
        commit('USER_SQLPush', allRows)
        // UserSQLite.markAsSync(allRows)
      })
    })
  },
  getUsers ({ commit }, page = 1) {
    UserResource.all(page).then(response => {
      commit('USER_LIST', response.data.data)
    })
  }
}

// getters are functions
const getters = {
  users: state => state.users,
  currentUser: state => state.currentUser,
  userPermissions: state => state.userPermissions,
  userRoles: state => state.userRoles
}

export default {
  state,
  getters,
  mutations,
  actions
}
