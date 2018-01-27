import NOAResource from '../../api/noa'
import NOASQLite from '../../sqlite/noa'
import { db } from '../../../server/db.js'

const state = {
  noa: [],
  noa_list: []
}

const mutations = {
  NOA_SQLLIST (state, noa) {
    state.noa_list = noa
  },
  NOA_LIST (state, noa) {
    state.noa = noa
  },
  NOA_SQLCreate (state, noa) {
    // state.noa.push(noa)
  },
  NOA_SQLSync (state, noa) {
    // state.noas.push(noa)
  },
  NOA_SQLPush (state, noa) {
    // state.noas.push(noa)
  }
}

const actions = {
  listNOA ({ commit }, [page = 0, q = ""]) {
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select notice_of_awards.*, unit_purchase_requests.mode_of_procurement from notice_of_awards LEFT JOIN unit_purchase_requests ON notice_of_awards.upr_id = unit_purchase_requests.id where unit_purchase_requests.mode_of_procurement != "public_bidding" AND (notice_of_awards.upr_number LIKE ?1 OR awarded_date LIKE ?1) LIMIT 20 OFFSET '+ page, {1: query},  function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('NOA_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('NOA_SQLLIST', data)
      })
    })
  },
  listBidNOA ({ commit }, [page = 0, q = ""]) {
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select notice_of_awards.*, unit_purchase_requests.mode_of_procurement from notice_of_awards LEFT JOIN unit_purchase_requests ON notice_of_awards.upr_id = unit_purchase_requests.id where unit_purchase_requests.mode_of_procurement = "public_bidding" AND (notice_of_awards.upr_number LIKE ?1 OR awarded_date LIKE ?1) LIMIT 20 OFFSET '+ page, {1: query},  function (err, allRows) {
        if (err != null) {
          commit('NOA_SQLLIST', err)
          console.log(err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('NOA_SQLLIST', data)
      })
    })
  },
  createNOA ({ commit }, noa) {
    commit('NOA_SQLCreate', NOASQLite.save(noa))
  },
  updateNOA ({ commit }, [id, model]) {
    commit('NOA_SQLCreate', NOASQLite.update(id, model))
  },
  syncNOA ({ commit }, noa) {
    NOAResource.all().then(response => {
      commit('NOA_SQLSync', NOASQLite.syncNew(response.data.data))
    })
  },
  serverNOAPush ({ commit }) {
    // commit('NOA_SQLPush', NOASQLite.serverPush(NOASQLite.getNew()))
    db.serialize(function () {
      db.all('select * from notice_of_awards where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('NOA_SQLPush', err)
        }
        NOAResource.serverPush(allRows)
        commit('NOA_SQLPush', allRows)
        // NOASQLite.markAsSync(allRows)
      })
    })
  },
  getNOA ({ commit }, id) {
    db.serialize(function () {
      db.get('select notice_of_awards.*, unit_purchase_requests.total_amount from notice_of_awards LEFT JOIN unit_purchase_requests on notice_of_awards.upr_id = unit_purchase_requests.id where notice_of_awards.id =?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('NOA_LIST', err)
        }
        commit('NOA_LIST', allRows)
      })
    })
  },
  getNOAByUPR ({ commit }, id) {
    db.serialize(function () {
      db.get('select notice_of_awards.*, unit_purchase_requests.total_amount from notice_of_awards LEFT JOIN unit_purchase_requests on notice_of_awards.upr_id = unit_purchase_requests.id where notice_of_awards.upr_id =?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('NOA_LIST', err)
        }
        commit('NOA_LIST', allRows)
      })
    })
  }
}

// getters are functions
const getters = {
  noa: state => state.noa,
  noa_list: state => state.noa_list
}

export default {
  state,
  getters,
  mutations,
  actions
}
