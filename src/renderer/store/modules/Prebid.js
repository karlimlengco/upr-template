import PrebidResource from '../../api/pre-bid'
import PrebidSQLite from '../../sqlite/pre-bid'
import { db } from '../../../server/db.js'

const state = {
  prebids: []
}

const mutations = {
  PREBID_SQLLIST (state, inspection_report) {
    state.prebids = inspection_report
  },
  PREBID_LIST (state, inspection_report) {
    state.prebids = inspection_report
  },
  PREBID_SQLCreate (state, inspection_report) {
    // state.inspection_report.push(inspection_report)
  },
  PREBID_SQLSync (state, inspection_report) {
    // state.puchase_orders.push(inspection_report)
  },
  PREBID_SQLPush (state, inspection_report) {
    // state.POs.push(inspection_report)
  }
}

const actions = {
  listPrebid ({ commit }, [page = 0, q = ""]) {
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select * from pre_bid_conferences WHERE upr_number LIKE ?1 OR ref_number LIKE ?1 OR transaction_date LIKE ?1 OR bid_opening_date LIKE ?1 OR resched_date LIKE ?1 OR resched_remarks LIKE ?1 LIMIT 20 OFFSET '+ page, {1: query}, function (err, allRows) {
        if (err != null) {
          commit('PREBID_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('PREBID_SQLLIST', data)
      })
    })
  },
  createPrebid ({ commit }, inspection_report) {
    commit('PREBID_SQLCreate', PrebidSQLite.save(inspection_report))
  },
  updatePrebid ({ commit }, [id, inspection_report]) {
    commit('PREBID_SQLCreate', PrebidSQLite.update(id, inspection_report))
  },
  syncPrebid ({ commit }, inspection_report) {
    PrebidResource.all().then(response => {
      commit('PREBID_SQLSync', PrebidSQLite.syncNew(response.data.data))
    })
  },
  serverPrebidPush ({ commit }) {
    // commit('PREBID_SQLPush', PrebidSQLite.serverPush(PrebidSQLite.getNew()))
    db.serialize(function () {
      db.all('select * from pre_bid_conferences where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('PREBID_SQLPush', err)
        }
        PrebidResource.serverPush(allRows)
        commit('PREBID_SQLPush', allRows)
        // PrebidSQLite.markAsSync(allRows)
      })
    })
  },
  getPrebid ({ commit }, id) {
    db.serialize(function () {
      db.get('select pre_bid_conferences.* from pre_bid_conferences where pre_bid_conferences.id =?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('PREBID_LIST', err)
        }
        commit('PREBID_LIST', allRows)
      })
    })
  },
  getPrebidByUpr ({ commit }, id) {
    db.serialize(function () {
      db.get('select pre_bid_conferences.* from pre_bid_conferences where pre_bid_conferences.upr_id =?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('PREBID_LIST', err)
        }
        commit('PREBID_LIST', allRows)
      })
    })
  }
}

// getters are functions
const getters = {
  prebids: state => state.prebids
}

export default {
  state,
  getters,
  mutations,
  actions
}
