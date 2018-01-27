import DIIRResource from '../../api/diir'
import DIIRSQLite from '../../sqlite/diir'
import { db } from '../../../server/db.js'

const state = {
  deliveryInspection: []
}

const mutations = {
  DIIR_SQLLIST (state, delivery_inspection) {
    state.deliveryInspection = delivery_inspection
  },
  DIIR_LIST (state, delivery_inspection) {
    state.deliveryInspection = delivery_inspection
  },
  DIIR_SQLCreate (state, delivery_inspection) {
    // state.delivery_inspection.push(delivery_inspection)
  },
  DIIR_SQLSync (state, delivery_inspection) {
    // state.puchase_orders.push(delivery_inspection)
  },
  DIIR_SQLPush (state, delivery_inspection) {
    // state.POs.push(delivery_inspection)
  }
}

const actions = {
  listDIIR ({ commit }, [page = 0, q = ""]) {
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select delivery_inspection.*, unit_purchase_requests.mode_of_procurement from delivery_inspection LEFT JOIN unit_purchase_requests ON delivery_inspection.upr_id = unit_purchase_requests.id where unit_purchase_requests.mode_of_procurement != "public_bidding" AND (delivery_inspection.upr_number LIKE ?1 OR delivery_inspection.status LIKE ?1 OR ref_number LIKE ?1) LIMIT 20 OFFSET '+ page, {1: query}, function (err, allRows) {
        if (err != null) {
          commit('DIIR_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('DIIR_SQLLIST', data)
      })
    })
  },
  listBidDIIR ({ commit }, [page = 0, q = ""]) {
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select delivery_inspection.*, unit_purchase_requests.mode_of_procurement from delivery_inspection LEFT JOIN unit_purchase_requests ON delivery_inspection.upr_id = unit_purchase_requests.id where unit_purchase_requests.mode_of_procurement = "public_bidding" AND (delivery_inspection.upr_number LIKE ?1 OR delivery_inspection.status LIKE ?1 OR ref_number LIKE ?1) LIMIT 20 OFFSET '+ page, {1: query}, function (err, allRows) {
        if (err != null) {
          commit('DIIR_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('DIIR_SQLLIST', data)
      })
    })
  },
  updateDIIR ({ commit }, [id, model]) {
    commit('DIIR_SQLCreate', DIIRSQLite.update(id, model))
  },
  createDIIR ({ commit }, delivery_inspection) {
    commit('DIIR_SQLCreate', DIIRSQLite.save(delivery_inspection))
  },
  syncDIIR ({ commit }, delivery_inspection) {
    DIIRResource.all().then(response => {
      commit('DIIR_SQLSync', DIIRSQLite.syncNew(response.data.data))
    })
  },
  serverDIIRPush ({ commit }) {
    // commit('DIIR_SQLPush', DIIRSQLite.serverPush(DIIRSQLite.getNew()))
    db.serialize(function () {
      db.all('select * from delivery_inspection where is_sync is null', function (err, allRows) {
        if (err != null) {
          commit('DIIR_SQLPush', err)
        }
        DIIRResource.serverPush(allRows)
        commit('DIIR_SQLPush', allRows)
        // DIIRSQLite.markAsSync(allRows)
      })
    })
  },
  getDIIRByUPR ({ commit }, id) {
    db.serialize(function () {
      db.get('select delivery_inspection.*, purchase_orders.bid_amount from delivery_inspection LEFT JOIN purchase_orders ON purchase_orders.upr_id = unit_purchase_requests.id LEFT JOIN unit_purchase_requests on delivery_inspection.upr_id = unit_purchase_requests.id where delivery_inspection.upr_id =? ', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('DIIR_LIST', err)
        }
        commit('DIIR_LIST', allRows)
      })
    })
  },
  getDIIR ({ commit }, id) {
    db.serialize(function () {
      db.get('select delivery_inspection.* from delivery_inspection where delivery_inspection.id =?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('DIIR_LIST', err)
        }
        commit('DIIR_LIST', allRows)
      })
    })
  }
}

// getters are functions
const getters = {
  deliveryInspection: state => state.deliveryInspection
}

export default {
  state,
  getters,
  mutations,
  actions
}
