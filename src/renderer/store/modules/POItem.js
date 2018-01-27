import POItemResource from '../../api/purchase-order-item'
import POItemSQLite from '../../sqlite/purchase-order-item'
import { db } from '../../../server/db.js'

const state = {
  purchaseOrderItems: []
}

const mutations = {
  POITEM_SQLLIST (state, puchase_order_items) {
    state.purchaseOrderItems = puchase_order_items
  },
  POITEM_LIST (state, puchase_order_items) {
    state.purchaseOrderItems = puchase_order_items
  },
  POITEM_SQLCreate (state, puchase_order_items) {
    // state.puchase_order_items.push(puchase_order_items)
  },
  POITEM_SQLSync (state, puchase_order_items) {
    // state.puchase_order_itemss.push(puchase_order_items)
  },
  POITEM_SQLPush (state, puchase_order_items) {
    // state.POs.push(purchase_order)
  }
}

const actions = {
  listPOItem ({ commit }, page = 1) {
    var data = {}
    db.serialize(function () {
      db.all('select * from purchase_order_items', function (err, allRows) {
        if (err != null) {
          commit('POITEM_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('POITEM_SQLLIST', data)
      })
    })
  },
  createPOItem ({ commit }, purchase_order) {
    commit('POITEM_SQLCreate', POItemSQLite.save(purchase_order))
  },
  syncPOItem ({ commit }, purchase_order) {
    POItemResource.all().then(response => {
      commit('POITEM_SQLSync', POItemSQLite.syncNew(response.data.data))
    })
  },
  serverPOItemPush ({ commit }) {
    // commit('POITEM_SQLPush', POItemSQLite.serverPush(POItemSQLite.getNew()))
    db.serialize(function () {
      db.all('select * from purchase_order_items where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('POITEM_SQLPush', err)
        }
        POItemResource.serverPush(allRows)
        commit('POITEM_SQLPush', allRows)
        // POItemSQLite.markAsSync(allRows)
      })
    })
  },
  getPOItem ({ commit }, id) {
    db.serialize(function () {
      db.get('select purchase_order_items.* from purchase_order_items where purchase_order_items.id =?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('POITEM_LIST', err)
        }
        commit('POITEM_LIST', allRows)
      })
    })
  },
  getPOItemByPO ({ commit }, id) {
    db.serialize(function () {
      db.all('select purchase_order_items.* from purchase_order_items where purchase_order_items.order_id =?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('POITEM_LIST', err)
        }
        commit('POITEM_LIST', allRows)
      })
    })
  },
  getPOItemByUPR ({ commit }, id) {
    db.serialize(function () {
      db.all('select purchase_order_items.*, purchase_orders.upr_id from purchase_order_items LEFT JOIN purchase_orders ON purchase_orders.id = purchase_order_items.order_id where purchase_orders.upr_id =?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('POITEM_LIST', err)
        }
        commit('POITEM_LIST', allRows)
      })
    })
  }
}

// getters are functions
const getters = {
  purchaseOrderItems: state => state.purchaseOrderItems
}

export default {
  state,
  getters,
  mutations,
  actions
}
