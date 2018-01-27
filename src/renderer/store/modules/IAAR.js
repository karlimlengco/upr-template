import IAARResource from '../../api/inspection-report'
import IAARSQLite from '../../sqlite/inspection-report'
import { db } from '../../../server/db.js'

const state = {
  inspectionReport: []
}

const mutations = {
  IAAR_SQLLIST (state, inspection_report) {
    state.inspectionReport = inspection_report
  },
  IAAR_LIST (state, inspection_report) {
    state.inspectionReport = inspection_report
  },
  IAAR_SQLCreate (state, inspection_report) {
    // state.inspection_report.push(inspection_report)
  },
  IAAR_SQLSync (state, inspection_report) {
    // state.puchase_orders.push(inspection_report)
  },
  IAAR_SQLPush (state, inspection_report) {
    // state.POs.push(inspection_report)
  }
}

const actions = {
  listIAAR ({ commit }, [page = 0, q = ""]) {
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select inspection_acceptance_report.*, unit_purchase_requests.mode_of_procurement from inspection_acceptance_report LEFT JOIN unit_purchase_requests ON inspection_acceptance_report.upr_id = unit_purchase_requests.id where unit_purchase_requests.mode_of_procurement != "public_bidding" AND (inspection_acceptance_report.status LIKE ?1 OR inspection_acceptance_report.upr_number LIKE ?1 OR inspection_date LIKE ?1 OR ref_number LIKE ?1) LIMIT 20 OFFSET '+ page, {1: query}, function (err, allRows) {
        if (err != null) {
          console.log(err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('IAAR_SQLLIST', data)
      })
    })
  },
  listBidIAAR ({ commit }, [page = 0, q = ""]) {
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select inspection_acceptance_report.*, unit_purchase_requests.mode_of_procurement from inspection_acceptance_report LEFT JOIN unit_purchase_requests ON inspection_acceptance_report.upr_id = unit_purchase_requests.id where unit_purchase_requests.mode_of_procurement = "public_bidding" AND (inspection_acceptance_report.status LIKE ?1 OR inspection_acceptance_report.upr_number LIKE ?1 OR inspection_date LIKE ?1 OR ref_number LIKE ?1) LIMIT 20 OFFSET '+ page, {1: query}, function (err, allRows) {
        if (err != null) {
          console.log(err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('IAAR_SQLLIST', data)
      })
    })
  },
  createIAAR ({ commit }, inspection_report) {
    commit('IAAR_SQLCreate', IAARSQLite.save(inspection_report))
  },
  syncIAAR ({ commit }, inspection_report) {
    IAARResource.all().then(response => {
      commit('IAAR_SQLSync', IAARSQLite.syncNew(response.data.data))
    })
  },
  serverIAARPush ({ commit }) {
    // commit('IAAR_SQLPush', IAARSQLite.serverPush(IAARSQLite.getNew()))
    db.serialize(function () {
      db.all('select * from inspection_acceptance_report where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('IAAR_SQLPush', err)
        }
        IAARResource.serverPush(allRows)
        commit('IAAR_SQLPush', allRows)
        // IAARSQLite.markAsSync(allRows)
      })
    })
  },
  getIAAR ({ commit }, id) {
    db.serialize(function () {
      db.get('select inspection_acceptance_report.* from inspection_acceptance_report where inspection_acceptance_report.id =?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('IAAR_LIST', err)
        }
        commit('IAAR_LIST', allRows)
      })
    })
  },
  getIAARByUPR ({ commit }, id) {
    db.serialize(function () {
      db.get('select inspection_acceptance_report.*, unit_purchase_requests.total_amount from inspection_acceptance_report LEFT JOIN unit_purchase_requests on inspection_acceptance_report.upr_id = unit_purchase_requests.id where inspection_acceptance_report.upr_id =? ORDER BY created_at ', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('IAAR_LIST', err)
        }
        commit('IAAR_LIST', allRows)
      })
    })
  },
  updateIAAR ({ commit }, [id, model]) {
    commit('IAAR_SQLCreate', IAARSQLite.update(id, model))
  }
}

// getters are functions
const getters = {
  inspectionReport: state => state.inspectionReport
}

export default {
  state,
  getters,
  mutations,
  actions
}
