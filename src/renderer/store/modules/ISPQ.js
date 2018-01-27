import ISPQResource from '../../api/ispq'
import ISPQSQLite from '../../sqlite/ispq'
import { db } from '../../../server/db.js'


const state = {
  ispq: []
}

const mutations = {
  ISPQ_SQLLIST (state, ispq) {
    state.ispq = ispq
  },
  ISPQ_LIST (state, ispq) {
    state.ispq = ispq
  },
  ISPQ_LIST2 (state, ispq) {
    state.ispq = ispq
  },
  ISPQ_SQLCreate (state, ispq) {
    // state.ispqs.push(ispq)
  },
  ISPQ_SQLSync (state, ispq) {
    // state.ispqs.push(ispq)
  },
  ISPQ_SQLPush (state, ispq) {
    // state.ispqs.push(ispq)
  }
}

const actions = {
  listISPQ ({ commit }, page = 1) {
    // commit('ISPQ_SQLLIST', ISPQSQLite.getAll(page))
    var data = {}
    db.serialize(function () {
      db.all('select * from ispq_quotations limit 20 offset ' + page, function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('ISPQ_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('ISPQ_SQLLIST', data)
      })
    })
  },
  dropdownISPQ ({ commit }, page = 1) {
    // commit('ISPQ_SQLLIST', ISPQSQLite.getAll(page))
    db.serialize(function () {
      db.all('select * from ispq_quotations', function (err, allRows) {
        if (err != null) {
          commit('ISPQ_SQLLIST', err)
        }
        commit('ISPQ_LIST2', allRows)
      })
    })
  },
  createISPQ ({ commit }, ispq) {
    commit('ISPQ_SQLCreate', ISPQSQLite.save(ispq))
  },
  syncISPQ ({ commit }, ispq) {
    ISPQResource.all().then(response => {
      commit('ISPQ_SQLSync', ISPQSQLite.syncNew(response.data.data))
    })
  },
  serverISPQPush ({ commit }) {
    // commit('ISPQ_SQLPush', ISPQSQLite.serverPush(ISPQSQLite.getNew()))
    db.serialize(function () {
      db.all('select * from ispq_quotations where is_sync is null', function (err, allRows) {
        if (err != null) {
          commit('ISPQ_SQLPush', err)
        }
        ISPQResource.serverPush(allRows)
        commit('ISPQ_SQLPush', allRows)
      })
    })
  },
  getISPQ ({ commit }, id) {
    db.serialize(function () {
      db.get('select * from ispq_quotations where id=?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('ISPQ_LIST', err)
        }
        commit('ISPQ_LIST', allRows)
      })
    })
  },
  getISPQById ({ commit }, id) {
    db.serialize(function () {
      db.all('select *, unit_purchase_requests.procurement_office, mode_of_procurements.name as modes, procurement_centers.short_code, procurement_centers.name as center_name, procurement_centers.address as center_address from ispq_quotations LEFT JOIN unit_purchase_requests ON unit_purchase_requests.id = ispq_quotations.upr_id LEFT JOIN mode_of_procurements ON mode_of_procurements.id = unit_purchase_requests.mode_of_procurement LEFT JOIN procurement_centers ON procurement_centers.id = unit_purchase_requests.procurement_office where ispq_id=?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('ISPQ_LIST', err)
        }
        commit('ISPQ_LIST', allRows)
      })
    })
  }
}

// getters are functions
const getters = {
  ispq: state => state.ispq
}

export default {
  state,
  getters,
  mutations,
  actions
}
