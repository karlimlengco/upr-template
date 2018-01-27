import NTPResource from '../../api/ntp'
import NTPSQLite from '../../sqlite/ntp'
import { db } from '../../../server/db.js'

const state = {
  ntp: []
}

const mutations = {
  NTP_SQLLIST (state, ntp) {
    state.ntp = ntp
  },
  NTP_LIST (state, ntp) {
    state.ntp = ntp
  },
  NTP_SQLCreate (state, ntp) {
    // state.ntp.push(ntp)
  },
  NTP_SQLSync (state, ntp) {
    // state.ntps.push(ntp)
  },
  NTP_SQLPush (state, ntp) {
    // state.ntps.push(ntp)
  }
}

const actions = {
  listNTP ({ commit }, [page = 0, q = ""]) {
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select notice_to_proceed.*, unit_purchase_requests.mode_of_procurement from notice_to_proceed LEFT JOIN unit_purchase_requests ON notice_to_proceed.upr_id = unit_purchase_requests.id where unit_purchase_requests.mode_of_procurement != "public_bidding" AND (notice_to_proceed.upr_number LIKE ?1 OR prepared_date LIKE ?1 OR notice_to_proceed.status LIKE ?1 OR ref_number LIKE ?1) LIMIT 20 OFFSET '+ page, {1: query}, function (err, allRows) {
        if (err != null) {
          console.log(err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('NTP_SQLLIST', data)
      })
    })
  },
  listBidNTP ({ commit }, [page = 0, q = ""]) {
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select notice_to_proceed.*, unit_purchase_requests.mode_of_procurement from notice_to_proceed LEFT JOIN unit_purchase_requests ON notice_to_proceed.upr_id = unit_purchase_requests.id where unit_purchase_requests.mode_of_procurement = "public_bidding" AND (notice_to_proceed.upr_number LIKE ?1 OR prepared_date LIKE ?1 OR notice_to_proceed.status LIKE ?1 OR ref_number LIKE ?1) LIMIT 20 OFFSET '+ page, {1: query}, function (err, allRows) {
        if (err != null) {
          console.log(err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('NTP_SQLLIST', data)
      })
    })
  },
  updateNTP ({ commit }, [id, model]) {
    commit('NTP_SQLCreate', NTPSQLite.update(id, model))
  },
  createNTP ({ commit }, ntp) {
    commit('NTP_SQLCreate', NTPSQLite.save(ntp))
  },
  syncNTP ({ commit }, ntp) {
    NTPResource.all().then(response => {
      commit('NTP_SQLSync', NTPSQLite.syncNew(response.data.data))
    })
  },
  serverNTPPush ({ commit }) {
    // commit('NTP_SQLPush', NTPSQLite.serverPush(NTPSQLite.getNew()))
    db.serialize(function () {
      db.all('select * from notice_to_proceed where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('NTP_SQLPush', err)
        }
        NTPResource.serverPush(allRows)
        commit('NTP_SQLPush', allRows)
        // NTPSQLite.markAsSync(allRows)
      })
    })
  },
  getNTP ({ commit }, id) {
    db.serialize(function () {
      db.get('select notice_to_proceed.*, purchase_orders.po_number from notice_to_proceed LEFT JOIN purchase_orders ON purchase_orders.upr_id = notice_to_proceed.upr_id where notice_to_proceed.id =?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('NTP_LIST', err)
        }
        commit('NTP_LIST', allRows)
      })
    })
  },
  getNTPByUPR ({ commit }, id) {
    db.serialize(function () {
      db.get('select notice_to_proceed.*, unit_purchase_requests.total_amount from notice_to_proceed LEFT JOIN unit_purchase_requests on notice_to_proceed.upr_id = unit_purchase_requests.id where notice_to_proceed.upr_id =?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('NTP_LIST', err)
        }
        commit('NTP_LIST', allRows)
      })
    })
  }
}

// getters are functions
const getters = {
  ntp: state => state.ntp
}

export default {
  state,
  getters,
  mutations,
  actions
}
