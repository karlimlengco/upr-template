import RFQResource from '../../api/rfq'
import RFQSQLite from '../../sqlite/rfq'
import { db } from '../../../server/db.js'

const state = {
  rfq: []
}

const mutations = {
  RFQ_SQLLIST (state, rfq) {
    state.rfq = rfq
  },
  RFQ_LIST (state, rfq) {
    state.rfq = rfq
  },
  RFQ_SQLCreate (state, rfq) {
    // state.rfq.push(rfq)
  },
  RFQ_UPDATE (state, rfq) {
    // state.rfq.push(rfq)
  },
  RFQ_SQLSync (state, rfq) {
    // state.rfq.push(rfq)
  },
  RFQ_SQLPush (state, rfq) {
    // state.rfq.push(rfq)
  }
}

const actions = {
  listRFQ ({ commit }, page = 1) {
    var data = {}
    db.serialize(function () {
      db.all('select * from request_for_quotations', function (err, allRows) {
        if (err != null) {
          commit('RFQ_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('RFQ_SQLLIST', data)
      })
    })
  },
  createRFQ ({ commit }, rfq) {
    commit('RFQ_SQLCreate', RFQSQLite.save(rfq))
  },
  syncRFQ ({ commit }, rfq) {
    RFQResource.all().then(response => {
      commit('RFQ_SQLSync', RFQSQLite.syncNew(response.data.data))
    })
  },
  serverRFQPush ({ commit }) {
    // commit('RFQ_SQLPush', RFQSQLite.serverPush(RFQSQLite.getNew()))
    db.serialize(function () {
      db.all('select * from request_for_quotations where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('RFQ_SQLPush', err)
        }
        RFQResource.serverPush(allRows)
        commit('RFQ_SQLPush', allRows)
        // RFQSQLite.markAsSync(allRows)
      })
    })
  },
  getRFQ ({ commit }, id) {
    db.serialize(function () {
      db.get('select * from request_for_quotations where id=?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('RFQ_LIST', err)
        }
        commit('RFQ_LIST', allRows)
      })
    })
  },
  updateRFQ ({ commit }, [id, model]) {
    commit('RFQ_UPDATE', RFQSQLite.update(id, model))
  },
  getRFQByUPR ({ commit }, id) {
    db.serialize(function () {
      db.get('select * from request_for_quotations where upr_id=?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('RFQ_LIST', err)
        }
        commit('RFQ_LIST', allRows)
      })
    })
  }
}

// getters are functions
const getters = {
  rfq: state => state.rfq
}

export default {
  state,
  getters,
  mutations,
  actions
}
