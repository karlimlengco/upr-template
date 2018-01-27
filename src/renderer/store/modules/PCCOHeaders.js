import PCCOHeadersResource from '../../api/pcco-headers'
import PCCOHeadersSQLite from '../../sqlite/pcco-headers'

import { db } from '../../../server/db.js'


const state = {
  pccoHeaders: []
}

const mutations = {
  PCCO_HEADER_SQLLIST (state, pcco) {
    state.pccoHeaders = pcco
  },
  PCCO_HEADER_LIST (state, pcco) {
    state.pccoHeaders = pcco
  },
  PCCO_HEADER_LIST2 (state, pcco) {
    state.pccoHeaders = pcco
  },
  PCCO_HEADER_SQLCreate (state, pcco) {
    // state.pccoHeaders.push(pcco)
  },
  PCCO_HEADER_SQLCreateNew (state, pcco) {
    state.pccoHeaders.push(pcco)
  },
  PCCO_HEADER_SQLSync (state, pcco) {
    // state.pccoHeaders.push(pcco)
  },
  PCCO_HEADER_SQLPush (state, pcco) {
    // state.pccoHeaders.push(pcco)
  }
}

const actions = {
  listFormHeaders ({ commit }, [page = 0, q = ""]) {
    // commit('PCCO_HEADER_SQLLIST', PCCOHeaderssQLite.getAll(page))
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select * from pcco_headers WHERE description LIKE ?1 OR name LIKE ?1 LIMIT 20 OFFSET ' + page, {1: query}, function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('PCCO_HEADER_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('PCCO_HEADER_SQLLIST', data)
      })
    })
  },
  dropdownPCCOHeaders ({ commit }, page = 1) {
    db.serialize(function () {
      db.all('select id, name, description from pcco_headers', function (err, allRows) {
        if (err != null) {
          commit('PCCO_HEADER_SQLLIST', err)
        }
        commit('PCCO_HEADER_LIST2', allRows)
      })
    })
  },
  createFormHeader ({ commit }, pcco) {
    var fields = []
    var values = []
    var placeholder = ""
    var count = 0
    for (var key in pcco) {
      if (count == 0) {
        placeholder += "?"
      } else {
        placeholder += ",?"
      }
      count ++

      fields.push(key)
      values.push(FormHeader[key])
    }
    db.serialize(function () {
      db.run("INSERT INTO pcco_headers (" + fields.join() + ") VALUES (" + placeholder + ")", values, function (err, row) {
        if (err) {
          console.log(err)
        }
        db.get('select * from pcco_headers order by created_at desc limit 1', function (err, allRows) {
          if (err != null) {
            commit('PCCO_HEADER_SQLLIST', err)
          }
          commit('PCCO_HEADER_SQLCreateNew', allRows)
        })
        // commit('PCCO_HEADER_SQLCreateNew', row)
      })
    })
  },
  syncPCCOHeaders ({ commit }, pcco) {
    PCCOHeadersResource.all().then(response => {
      commit('PCCO_HEADER_SQLSync', PCCOHeadersSQLite.syncNew(response.data.data))
    })
  },
  serverPCCOHeaderPush ({ commit }) {
    // commit('PCCO_HEADER_SQLPush', PCCOHeaderssQLite.serverPush(PCCOHeadersSQLite.getNew()))
    db.serialize(function () {
      db.all('select * from pcco_headers where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('PCCO_HEADER_SQLPush', err)
        }
        PCCOHeadersResource.serverPush(allRows)
        commit('PCCO_HEADER_SQLPush', allRows)
      })
    })
  },
  getPCCOHeaders ({ commit }, page = 1) {
    PCCOHeadersResource.all(page).then(response => {
      commit('PCCO_HEADER_LIST', response.data.data)
    })
  }
}

// getters are functions
const getters = {
  pccoHeaders: state => state.pccoHeaders
}

export default {
  state,
  getters,
  mutations,
  actions
}
