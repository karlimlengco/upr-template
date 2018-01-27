import POResource from '../../api/purchase-order'
import POSQLite from '../../sqlite/purchase-order'
import { db } from '../../../server/db.js'

const state = {
  purchaseOrders: []
}

const mutations = {
  PO_SQLLIST (state, puchase_order) {
    state.purchaseOrders = puchase_order
  },
  PO_LIST (state, puchase_order) {
    state.purchaseOrders = puchase_order
  },
  PO_SQLCreate (state, puchase_order) {
    // state.puchase_order.push(puchase_order)
  },
  PO_SQLSync (state, puchase_order) {
    // state.puchase_orders.push(puchase_order)
  },
  PO_SQLPush (state, puchase_order) {
    // state.POs.push(purchase_order)
  }
}

const actions = {
  listPO ({ commit }, [page = 0, q = ""]) {
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select purchase_orders.*, unit_purchase_requests.mode_of_procurement from purchase_orders LEFT JOIN unit_purchase_requests ON purchase_orders.upr_id = unit_purchase_requests.id where unit_purchase_requests.mode_of_procurement != "public_bidding" AND ( purchase_orders.upr_number LIKE ?1 OR bid_amount LIKE ?1 OR purchase_date LIKE ?1 OR ref_number LIKE ?1 ) LIMIT 20 OFFSET '+ page, {1: query}, function (err, allRows) {
        if (err != null) {
          console.log(err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('PO_SQLLIST', data)
      })
    })
  },
  listBidPO ({ commit }, [page = 0, q = ""]) {
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select purchase_orders.*, unit_purchase_requests.mode_of_procurement from purchase_orders LEFT JOIN unit_purchase_requests ON purchase_orders.upr_id = unit_purchase_requests.id where unit_purchase_requests.mode_of_procurement = "public_bidding" AND ( purchase_orders.upr_number LIKE ?1 OR bid_amount LIKE ?1 OR purchase_date LIKE ?1 OR ref_number LIKE ?1 ) LIMIT 20 OFFSET '+ page, {1: query}, function (err, allRows) {
        if (err != null) {
          console.log(err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('PO_SQLLIST', data)
      })
    })
  },
  createPO ({ commit }, purchase_order) {
    commit('PO_SQLCreate', POSQLite.save(purchase_order))
  },
  updatePO ({ commit }, [id, model]) {
    commit('PO_SQLCreate', POSQLite.update(id, model))
  },
  syncPO ({ commit }, purchase_order) {
    POResource.all().then(response => {
      commit('PO_SQLSync', POSQLite.syncNew(response.data.data))
    })
  },
  serverPOPush ({ commit }) {
    // commit('PO_SQLPush', POSQLite.serverPush(POSQLite.getNew()))
    db.serialize(function () {
      db.all('select * from purchase_orders where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('PO_SQLPush', err)
        }
        POResource.serverPush(allRows)
        commit('PO_SQLPush', allRows)
        // POSQLite.markAsSync(allRows)
      })
    })
  },
  getPO ({ commit }, id) {
    db.serialize(function () {
      db.get('select purchase_orders.* from purchase_orders where purchase_orders.id =?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('PO_LIST', err)
        }
        commit('PO_LIST', allRows)
      })
    })
  },
  getPOByUPR ({ commit }, id) {
    db.serialize(function () {
      db.get('select * from purchase_orders where upr_id=?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('PO_LIST', err)
        }
        commit('PO_LIST', allRows)
      })
    })
  }
}

// getters are functions
const getters = {
  purchaseOrders: state => state.purchaseOrders
}

export default {
  state,
  getters,
  mutations,
  actions
}
