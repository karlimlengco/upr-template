import VoucherResource from '../../api/voucher'
import VoucherSQLite from '../../sqlite/voucher'
import { db } from '../../../server/db.js'

const state = {
  vouchers: []
}

const mutations = {
  VOUCHER_SQLLIST (state, voucher) {
    state.vouchers = voucher
  },
  VOUCHER_LIST (state, voucher) {
    state.vouchers = voucher
  },
  VOUCHER_SQLCreate (state, voucher) {
    // state.voucher.push(voucher)
  },
  VOUCHER_SQLSync (state, voucher) {
    // state.puchase_orders.push(voucher)
  },
  VOUCHER_SQLPush (state, voucher) {
    // state.POs.push(voucher)
  }
}

const actions = {
  listVoucher ({ commit }, [page = 0, q = ""]) {
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select vouchers.*, unit_purchase_requests.mode_of_procurement from vouchers LEFT JOIN unit_purchase_requests ON vouchers.upr_id = unit_purchase_requests.id where unit_purchase_requests.mode_of_procurement != "public_bidding" AND (vouchers.upr_number LIKE ?1 OR vouchers.transaction_date LIKE ?1 OR ref_number LIKE ?1) LIMIT 20 OFFSET '+ page, {1: query}, function (err, allRows) {
        if (err != null) {
          commit('VOUCHER_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('VOUCHER_SQLLIST', data)
      })
    })
  },
  listBidVoucher ({ commit }, [page = 0, q = ""]) {
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select vouchers.*, unit_purchase_requests.mode_of_procurement from vouchers LEFT JOIN unit_purchase_requests ON vouchers.upr_id = unit_purchase_requests.id where unit_purchase_requests.mode_of_procurement = "public_bidding" AND (vouchers.upr_number LIKE ?1 OR vouchers.transaction_date LIKE ?1 OR ref_number LIKE ?1) LIMIT 20 OFFSET '+ page, {1: query}, function (err, allRows) {
        if (err != null) {
          commit('VOUCHER_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('VOUCHER_SQLLIST', data)
      })
    })
  },
  createVoucher ({ commit }, voucher) {
    commit('VOUCHER_SQLCreate', VoucherSQLite.save(voucher))
  },
  syncVoucher ({ commit }, voucher) {
    VoucherResource.all().then(response => {
      commit('VOUCHER_SQLSync', VoucherSQLite.syncNew(response.data.data))
    })
  },
  serverVoucherPush ({ commit }) {
    // commit('VOUCHER_SQLPush', VoucherSQLite.serverPush(VoucherSQLite.getNew()))
    db.serialize(function () {
      db.all('select * from vouchers where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('VOUCHER_SQLPush', err)
        }
        VoucherResource.serverPush(allRows)
        commit('VOUCHER_SQLPush', allRows)
        // VoucherSQLite.markAsSync(allRows)
      })
    })
  },
  getVoucher ({ commit }, id) {
    db.serialize(function () {
      db.get('select vouchers.* from vouchers where vouchers.id =?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('VOUCHER_LIST', err)
        }
        commit('VOUCHER_LIST', allRows)
      })
    })
  },
  getVoucherByUPR ({ commit }, id) {
    db.serialize(function () {
      db.get('select vouchers.*, purchase_orders.bid_amount from vouchers LEFT JOIN purchase_orders ON purchase_orders.upr_id = unit_purchase_requests.id LEFT JOIN unit_purchase_requests on vouchers.upr_id = unit_purchase_requests.id where vouchers.upr_id =? ', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('VOUCHER_LIST', err)
        }
        commit('VOUCHER_LIST', allRows)
      })
    })
  },
  updateVoucher ({ commit }, [id, model]) {
    commit('VOUCHER_SQLCreate', VoucherSQLite.update(id, model))
  }
}

// getters are functions
const getters = {
  vouchers: state => state.vouchers
}

export default {
  state,
  getters,
  mutations,
  actions
}
