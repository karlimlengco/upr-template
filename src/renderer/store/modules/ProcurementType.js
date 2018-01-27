import ProcurementTypeResource from '../../api/procurement-types'
import ProcurementTypeSQLite from '../../sqlite/procurement-types'
import { db } from '../../../server/db.js'


const state = {
  procurementTypes: []
}

const mutations = {
  PROCUREMENT_TYPE_SQLLIST (state, ProcurementTypes) {
    state.procurementTypes = ProcurementTypes
  },
  PROCUREMENT_TYPE_LIST (state, ProcurementTypes) {
    state.procurementTypes = ProcurementTypes
  },
  PROCUREMEN_TYPE_LIST2 (state, ProcurementTypes) {
    state.procurementTypes = ProcurementTypes
  },
  PROCUREMENT_TYPE_SQLCreate (state, procurement) {
    // state.ProcurementTypes.push(procurement)
  },
  PROCUREMENT_TYPE_SQLCreateNew (state, procurement) {
    state.procurementTypes.push(procurement)
  },
  PROCUREMENT_TYPE_SQLSync (state, procurement) {
    // state.ProcurementTypes.push(procurement)
  },
  PROCUREMENT_TYPE_SQLPush (state, procurement) {
    // state.ProcurementTypes.push(procurement)
  }
}

const actions = {
  listProcurementTypes ({ commit }, page = 0) {
    var data = {}
    db.serialize(function () {
      db.all('select * from procurement_types limit 20 offset ' + page, function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('PROCUREMENT_TYPE_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('PROCUREMENT_TYPE_SQLLIST', data)
      })
    })
  },
  dropdownProcurementTypes ({ commit }, page = 1) {
    // commit('PROCUREMENT_TYPE_SQLLIST', ProcurementTypeSQLite.getAll(page))
    db.serialize(function () {
      db.all('select id, code from procurement_types', function (err, allRows) {
        if (err != null) {
          commit('PROCUREMENT_TYPE_SQLLIST', err)
        }
        commit('PROCUREMEN_TYPE_LIST2', allRows)
      })
    })
  },
  createProcurementType ({ commit }, procurement) {

    var fields = []
    var values = []
    var placeholder = ""
    var count = 0
    for (var key in procurement) {
      if (count == 0) {
        placeholder += "?"
      } else {
        placeholder += ",?"
      }
      count ++

      fields.push(key)
      values.push(procurement[key])
    }
    db.serialize(function () {
      db.run("INSERT INTO procurement_types (" + fields.join() + ") VALUES (" + placeholder + ")", values, function (err, row) {
        if (err) {
          console.log(err)
        }
        db.get('select * from procurement_types order by created_at desc limit 1', function (err, allRows) {
          if (err != null) {
            commit('PROCUREMENT_TYPE_LIST', err)
          }
          commit('PROCUREMENT_TYPE_SQLCreateNew', allRows)
        })
        // commit('PROCUREMENT_TYPE_SQLCreateNew', row)
      })
    })

  },
  syncProcurementTypes ({ commit }, ProcurementTypes) {
    ProcurementTypeResource.all().then(response => {
      commit('PROCUREMENT_TYPE_SQLSync', ProcurementTypeSQLite.syncNew(response.data.data))
    })
  },
  serverProcurementTypePush ({ commit }) {
    // commit('PROCUREMENT_TYPE_SQLPush', ProcurementTypesQLite.serverPush(ProcurementTypeSQLite.getNew()))
    db.serialize(function () {
      db.all('select * from procurement_types where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('PROCUREMENT_TYPE_SQLPush', err)
        }
        ProcurementTypeResource.serverPush(allRows)
        commit('PROCUREMENT_TYPE_SQLPush', allRows)
      })
    })
  },
  getProcurementTypes ({ commit }, page = 1) {
    ProcurementTypeResource.all(page).then(response => {
      commit('PROCUREMENT_TYPE_LIST', response.data.data)
    })
  }
}

// getters are functions
const getters = {
  procurementTypes: state => state.procurementTypes
}

export default {
  state,
  getters,
  mutations,
  actions
}
