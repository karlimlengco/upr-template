import ProcurementModeResource from '../../api/p-modes'
import ProcurementModeSQLite from '../../sqlite/p-modes'
import { db } from '../../../server/db.js'


const state = {
  procurementModes: []
}

const mutations = {
  PROCUREMENT_MODE_SQLLIST (state, ProcurementModes) {
    state.procurementModes = ProcurementModes
  },
  PROCUREMENT_MODE_LIST (state, ProcurementModes) {
    state.procurementModes = ProcurementModes
  },
  PROCUREMENT_MODE_LIST2 (state, ProcurementModes) {
    state.procurementModes = ProcurementModes
  },
  PROCUREMENT_MODE_SQLCreate (state, procurement) {
    // state.ProcurementCenters.push(procurement)
  },
  PROCUREMENT_MODE_SQLSync (state, procurement) {
    // state.ProcurementCenters.push(procurement)
  },
  PROCUREMENT_MODE_SQLPush (state, procurement) {
    // state.ProcurementCenters.push(procurement)
  }
}

const actions = {
  listProcurementModes ({ commit }, [page = 0, q = ""]) {
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select * from mode_of_procurements WHERE name LIKE ?1 OR description LIKE ?1 LIMIT 20 OFFSET ' + page, {1: query}, function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('PROCUREMENT_MODE_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('PROCUREMENT_MODE_SQLLIST', data)
      })
    })
  },
  dropdownProcurementModes ({ commit }, page = 1) {
    // commit('PROCUREMENT_MODE_SQLLIST', ProcurementModeSQLite.getAll(page))
    db.serialize(function () {
      db.all('select id, name from mode_of_procurements', function (err, allRows) {
        if (err != null) {
          commit('PROCUREMENT_MODE_SQLLIST', err)
        }
        commit('PROCUREMENT_MODE_LIST2', allRows)
      })
    })
  },
  createProcurementMode ({ commit }, procurement) {
    commit('PROCUREMENT_MODE_SQLCreate', ProcurementModeSQLite.save(procurement))
  },
  syncProcurementModes ({ commit }, ProcurementCenters) {
    ProcurementModeResource.all().then(response => {
      commit('PROCUREMENT_MODE_SQLSync', ProcurementModeSQLite.syncNew(response.data.data))
    })
  },
  serverProcurementModePush ({ commit }) {
    // commit('PROCUREMENT_MODE_SQLPush', ProcurementModesQLite.serverPush(ProcurementModeSQLite.getNew()))
    db.serialize(function () {
      db.all('select * from mode_of_procurements where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('PROCUREMENT_MODE_SQLPush', err)
        }
        ProcurementModeResource.serverPush(allRows)
        commit('PROCUREMENT_MODE_SQLPush', allRows)
      })
    })
  },
  getProcurementModes ({ commit }, page = 1) {
    ProcurementModeResource.all(page).then(response => {
      commit('PROCUREMENT_MODE_LIST', response.data.data)
    })
  }
}

// getters are functions
const getters = {
  procurementModes: state => state.procurementModes
}

export default {
  state,
  getters,
  mutations,
  actions
}
