import UnitResource from '../../api/catered_units'
import UnitSQLite from '../../sqlite/catered_units'
import { db } from '../../../server/db.js'


const state = {
  units: []
}

const mutations = {
  UNIT_SQLLIST (state, units) {
    state.units = units
  },
  UNIT_LIST (state, units) {
    state.units = units
  },
  UNIT_LIST2 (state, units) {
    state.units = units
  },
  UNIT_SQLCreate (state, unit) {
    // state.units.push(unit)
  },
  UNIT_SQLSync (state, unit) {
    // state.units.push(unit)
  },
  UNIT_SQLPush (state, unit) {
    // state.units.push(unit)
  }
}

const actions = {
  listUnitsByPcco ({ commit }, pcco) {
    // commit('UNIT_SQLLIST', UnitSQLite.getAll(page))
    var data = {}
    db.serialize(function () {
      db.all('select * from catered_units  WHERE pcco_id =?2 ' , {2:pcco}, function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('UNIT_SQLLIST', err)
        }
        // console.log(allRows)
        commit('UNIT_SQLLIST', allRows)
      })
    })
  },
  listUnits ({ commit }, [page = 0, q = ""]) {
    // commit('UNIT_SQLLIST', UnitSQLite.getAll(page))
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select * from catered_units  WHERE short_code LIKE ?1 OR description LIKE ?1 limit 20 offset ' + page, {1: query}, function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('UNIT_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('UNIT_SQLLIST', data)
      })
    })
  },
  dropdownUnits ({ commit }, page = 1) {
    // commit('UNIT_SQLLIST', UnitSQLite.getAll(page))
    db.serialize(function () {
      db.all('select * from catered_units', function (err, allRows) {
        if (err != null) {
          commit('UNIT_SQLLIST', err)
        }
        commit('UNIT_LIST2', allRows)
      })
    })
  },
  createUnit ({ commit }, unit) {
    commit('UNIT_SQLCreate', UnitSQLite.save(unit))
  },
  syncUnits ({ commit }, units) {
    UnitResource.all().then(response => {
      commit('UNIT_SQLSync', UnitSQLite.syncNew(response.data.data))
    })
  },
  serverUnitPush ({ commit }) {
    // commit('UNIT_SQLPush', UnitSQLite.serverPush(UnitSQLite.getNew()))
    db.serialize(function () {
      db.all('select * from catered_units where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('UNIT_SQLPush', err)
        }
        UnitResource.serverPush(allRows)
        commit('UNIT_SQLPush', allRows)
      })
    })
  },
  getUnits ({ commit }, page = 1) {
    UnitResource.all(page).then(response => {
      commit('UNIT_LIST', response.data.data)
    })
  }
}

// getters are functions
const getters = {
  units: state => state.units
}

export default {
  state,
  getters,
  mutations,
  actions
}
