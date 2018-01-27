import NODResource from '../../api/nod'
import NODSQLite from '../../sqlite/nod'
import { db } from '../../../server/db.js'

const state = {
  nod: []
}

const mutations = {
  NOD_SQLLIST (state, nod) {
    state.nod = nod
  },
  NOD_LIST (state, nod) {
    state.nod = nod
  },
  NOD_SQLCreate (state, nod) {
    // state.nod.push(nod)
  },
  NOD_SQLSync (state, nod) {
    // state.nod.push(nod)
  },
  NOD_SQLPush (state, nod) {
    // state.nod.push(nod)
  }
}

const actions = {
  listNOD ({ commit }, [page = 0, q = ""]) {
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select delivery_orders.*, unit_purchase_requests.mode_of_procurement from delivery_orders LEFT JOIN unit_purchase_requests ON delivery_orders.upr_id = unit_purchase_requests.id where unit_purchase_requests.mode_of_procurement != "public_bidding" AND (delivery_orders.upr_number LIKE ?1 OR delivery_orders.status LIKE ?1 OR delivery_number LIKE ?1 OR expected_date LIKE ?1 OR ref_number LIKE ?1) LIMIT 20 OFFSET '+ page, {1: query}, function (err, allRows) {
        if (err != null) {
          console.log(err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('NOD_SQLLIST', data)
      })
    })
  },
  updateNOD ({ commit }, [id, model]) {
    commit('NOD_SQLCreate', NODSQLite.update(id, model))
  },
  listBidNOD ({ commit }, [page = 0, q = ""]) {
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select delivery_orders.*, unit_purchase_requests.mode_of_procurement from delivery_orders LEFT JOIN unit_purchase_requests ON delivery_orders.upr_id = unit_purchase_requests.id where unit_purchase_requests.mode_of_procurement = "public_bidding" AND (delivery_orders.upr_number LIKE ?1 OR delivery_orders.status LIKE ?1 OR delivery_number LIKE ?1 OR expected_date LIKE ?1 OR ref_number LIKE ?1) LIMIT 20 OFFSET '+ page, {1: query}, function (err, allRows) {
        if (err != null) {
          console.log(err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('NOD_SQLLIST', data)
      })
    })
  },
  createNOD ({ commit }, nod) {
    commit('NOD_SQLCreate', NODSQLite.save(nod))
  },
  syncNOD ({ commit }, nod) {
    NODResource.all().then(response => {
      commit('NOD_SQLSync', NODSQLite.syncNew(response.data.data))
    })
  },
  serverNODPush ({ commit }) {
    // commit('NOD_SQLPush', NODSQLite.serverPush(NODSQLite.getNew()))
    db.serialize(function () {
      db.all('select * from delivery_orders where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('NOD_SQLPush', err)
        }
        NODResource.serverPush(allRows)
        commit('NOD_SQLPush', allRows)
        // NODSQLite.markAsSync(allRows)
      })
    })
  },
  getNOD ({ commit }, id) {
    db.serialize(function () {
      db.get('select delivery_orders.*, purchase_orders.po_number from delivery_orders LEFT JOIN purchase_orders ON purchase_orders.upr_id = delivery_orders.upr_id where delivery_orders.id =?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('NOD_LIST', err)
        }
        commit('NOD_LIST', allRows)
      })
    })
  },
  getNODByUPR ({ commit }, id) {
    db.serialize(function () {
      db.get('select delivery_orders.*, unit_purchase_requests.total_amount from delivery_orders LEFT JOIN unit_purchase_requests on delivery_orders.upr_id = unit_purchase_requests.id where delivery_orders.upr_id =? ORDER BY created_at ', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('NOD_LIST', err)
        }
        commit('NOD_LIST', allRows)
      })
    })
  }
}

// getters are functions
const getters = {
  nod: state => state.nod
}

export default {
  state,
  getters,
  mutations,
  actions
}
