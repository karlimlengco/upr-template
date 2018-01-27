import ChargeabilityResource from '../../api/chargeability'
import ChargeabilitySQLite from '../../sqlite/chargeability'

import { db } from '../../../server/db.js'


const state = {
  chargeabilities: []
}

const mutations = {
  CHARGEABILITY_SQLLIST (state, chargeabilities) {
    state.chargeabilities = chargeabilities
  },
  CHARGEABILITY_LIST (state, chargeabilities) {
    state.chargeabilities = chargeabilities
  },
  CHARGEABILITY_LIST2 (state, chargeabilities) {
    state.chargeabilities = chargeabilities
  },
  CHARGEABILITY_SQLCreate (state, chargeability) {
    // state.chargeabilities.push(chargeability)
  },
  CHARGEABILITY_SQLCreateNew (state, chargeability) {
    state.chargeabilities.push(chargeability)
  },
  CHARGEABILITY_SQLSync (state, chargeability) {
    // state.chargeabilities.push(chargeability)
  },
  CHARGEABILITY_SQLPush (state, chargeability) {
    // state.chargeabilities.push(chargeability)
  }
}

const actions = {
  listChargeabilitys ({ commit }, [page = 0, q = ""]) {
    // commit('CHARGEABILITY_SQLLIST', ChargeabilitysQLite.getAll(page))
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select * from chargeability WHERE description LIKE ?1 OR name LIKE ?1 LIMIT 20 OFFSET ' + page, {1: query}, function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('CHARGEABILITY_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('CHARGEABILITY_SQLLIST', data)
      })
    })
  },
  dropdownChargeabilitys ({ commit }, page = 1) {
    db.serialize(function () {
      db.all('select id, name, description from chargeability', function (err, allRows) {
        if (err != null) {
          commit('CHARGEABILITY_SQLLIST', err)
        }
        commit('CHARGEABILITY_LIST2', allRows)
      })
    })
  },
  createChargeability ({ commit }, chargeability) {
    var fields = []
    var values = []
    var placeholder = ""
    var count = 0
    for (var key in chargeability) {
      if (count == 0) {
        placeholder += "?"
      } else {
        placeholder += ",?"
      }
      count ++

      fields.push(key)
      values.push(chargeability[key])
    }
    db.serialize(function () {
      db.run("INSERT INTO chargeability (" + fields.join() + ") VALUES (" + placeholder + ")", values, function (err, row) {
        if (err) {
          console.log(err)
        }
        db.get('select * from chargeability order by created_at desc limit 1', function (err, allRows) {
          if (err != null) {
            commit('CHARGEABILITY_SQLLIST', err)
          }
          commit('CHARGEABILITY_SQLCreateNew', allRows)
        })
        // commit('CHARGEABILITY_SQLCreateNew', row)
      })
    })
  },
  syncChargeabilitys ({ commit }, chargeabilities) {
    ChargeabilityResource.all().then(response => {
      commit('CHARGEABILITY_SQLSync', ChargeabilitySQLite.syncNew(response.data.data))
    })
  },
  serverChargeabilityPush ({ commit }) {
    // commit('CHARGEABILITY_SQLPush', ChargeabilitysQLite.serverPush(ChargeabilitySQLite.getNew()))
    db.serialize(function () {
      db.all('select * from chargeability where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('CHARGEABILITY_SQLPush', err)
        }
        ChargeabilityResource.serverPush(allRows)
        commit('CHARGEABILITY_SQLPush', allRows)
      })
    })
  },
  getChargeabilitys ({ commit }, page = 1) {
    ChargeabilityResource.all(page).then(response => {
      commit('CHARGEABILITY_LIST', response.data.data)
    })
  }
}

// getters are functions
const getters = {
  chargeabilities: state => state.chargeabilities
}

export default {
  state,
  getters,
  mutations,
  actions
}
