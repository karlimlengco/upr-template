import ProcurementCenterResource from '../../api/pcco'
import ProcurementCenterSQLite from '../../sqlite/pcco'
import { db } from '../../../server/db.js'


const state = {
  procurementCenters: [],
  programsCenter: []
}

const mutations = {
  PROCUREMENT_CENTER_SQLLIST (state, ProcurementCenters) {
    state.procurementCenters = ProcurementCenters
  },
  PROCUREMENT_CENTER_LIST (state, ProcurementCenters) {
    state.procurementCenters = ProcurementCenters
  },
  PROCUREMENT_CENTER_PROGRAMS (state, ProcurementCenters) {
    state.programsCenter = ProcurementCenters
  },
  PROCUREMENT_CENTER_LIST2 (state, ProcurementCenters) {
    state.procurementCenters = ProcurementCenters
  },
  PROCUREMENT_CENTER_SQLCreate (state, procurement) {
    // state.ProcurementCenters.push(procurement)
  },
  PROCUREMENT_CENTER_SQLSync (state, procurement) {
    // state.ProcurementCenters.push(procurement)
  },
  PROCUREMENT_CENTER_SQLPush (state, procurement) {
    // state.ProcurementCenters.push(procurement)
  }
}

const actions = {
  listProcurements ({ commit }, [page = 0, q = ""]) {
    var query  =  "%"+ q +"%"
    var data = {}
    db.serialize(function () {
      db.all('select * from procurement_centers WHERE name LIKE ?1 OR short_code LIKE ?1 OR address LIKE ? limit 20 offset ' + page, {1: query}, function (err, allRows) {
        if (err != null) {
          commit('PROCUREMENT_CENTER_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('PROCUREMENT_CENTER_SQLLIST', data)
      })
    })
  },
  dropdownProcurements ({ commit }, page = 1) {
    // commit('PROCUREMENT_CENTER_SQLLIST', ProcurementCenterSQLite.getAll(page))
    db.serialize(function () {
      db.all('select id, name from procurement_centers', function (err, allRows) {
        if (err != null) {
          commit('PROCUREMENT_CENTER_SQLLIST', err)
        }
        commit('PROCUREMENT_CENTER_LIST2', allRows)
      })
    })
  },
  getPrograms ({ commit }, [date_from, date_to]) {
    // and unit_purchase_requests.units = '$unit_id'
    //strftime('%w', cal_date)
    db.serialize(function () {
      db.all("SELECT  (SELECT COUNT(unit_purchase_requests.id) FROM unit_purchase_requests LEFT JOIN procurement_centers AS pc ON unit_purchase_requests.procurement_office  = pc.id WHERE mode_of_procurement  = 'public_bidding'  AND unit_purchase_requests.status != 'draft' AND programs = procurement_centers.programs AND unit_purchase_requests.date_prepared >= ?1 AND unit_purchase_requests.date_prepared <= ?2) AS upr_count, (SELECT COUNT(unit_purchase_requests.id) FROM unit_purchase_requests LEFT JOIN procurement_centers AS pc on unit_purchase_requests.procurement_office  = pc.id WHERE mode_of_procurement = 'public_bidding' AND programs = procurement_centers.programs AND unit_purchase_requests.date_prepared >= ?1 AND unit_purchase_requests.date_prepared <= ?2 AND unit_purchase_requests.state = 'Cancelled' AND unit_purchase_requests.status != 'draft') AS cancelled_count, IFNULL( (SELECT SUM(CASE WHEN 5 * ( (date('now') - unit_purchase_requests.next_due) / 7) + SUBSTR('0123444401233334012222340111123400001234000123440', 7 * strftime('%w', unit_purchase_requests.next_due) + strftime('%w', date('now')) + 1, 1) > 0 AND unit_purchase_requests.state != 'completed' AND unit_purchase_requests.status != 'draft' AND unit_purchase_requests.state != 'Cancelled' THEN 1 ELSE 0 END) FROM unit_purchase_requests LEFT JOIN procurement_centers AS pc ON unit_purchase_requests.procurement_office = pc.id WHERE mode_of_procurement  = 'public_bidding' AND unit_purchase_requests.next_due <  date('now') AND programs = procurement_centers.programs AND unit_purchase_requests.status != 'draft' AND unit_purchase_requests.date_prepared >= ?1 AND unit_purchase_requests.date_prepared <= ?2 ) ,0 ) AS delay_count, (SELECT COUNT(unit_purchase_requests.id) FROM unit_purchase_requests LEFT JOIN procurement_centers AS pc ON unit_purchase_requests.procurement_office  = pc.id WHERE mode_of_procurement  = 'public_bidding' AND programs = procurement_centers.programs AND unit_purchase_requests.status != 'draft' AND unit_purchase_requests.state = 'completed' AND unit_purchase_requests.date_prepared >= ?1 AND unit_purchase_requests.date_prepared <= ?2) AS completed_count, (SELECT COUNT(unit_purchase_requests.id) FROM unit_purchase_requests LEFT JOIN procurement_centers AS pc ON unit_purchase_requests.procurement_office  = pc.id WHERE mode_of_procurement  = 'public_bidding' AND programs = procurement_centers.programs AND unit_purchase_requests.date_prepared >= ?1 AND unit_purchase_requests.status != 'draft' AND unit_purchase_requests.date_prepared <= ?2 AND unit_purchase_requests.state != 'Cancelled') - (SELECT COUNT(unit_purchase_requests.id) FROM unit_purchase_requests LEFT JOIN procurement_centers AS pc ON unit_purchase_requests.procurement_office  = pc.id WHERE mode_of_procurement = 'public_bidding' AND programs = procurement_centers.programs AND unit_purchase_requests.status != 'draft' AND  unit_purchase_requests.date_prepared >= ?1 AND unit_purchase_requests.date_prepared <= ?2  AND unit_purchase_requests.state != 'Cancelled' AND unit_purchase_requests.state = 'completed') AS ongoing_count, (SELECT SUM(unit_purchase_requests.total_amount) FROM unit_purchase_requests LEFT JOIN procurement_centers AS pc ON unit_purchase_requests.procurement_office  = pc.id WHERE mode_of_procurement  = 'public_bidding' AND programs = procurement_centers.programs AND unit_purchase_requests.status != 'draft' AND unit_purchase_requests.date_prepared >= ?1 AND unit_purchase_requests.date_prepared <= ?2) AS total_abc, (SELECT SUM(po.bid_amount) FROM unit_purchase_requests LEFT JOIN procurement_centers AS pc ON unit_purchase_requests.procurement_office  = pc.id LEFT JOIN purchase_orders AS po ON unit_purchase_requests.id  = po.upr_id WHERE mode_of_procurement  = 'public_bidding' AND programs = procurement_centers.programs AND unit_purchase_requests.status != 'draft' AND unit_purchase_requests.date_prepared >= ?1 AND unit_purchase_requests.date_prepared <= ?2) AS total_bid, ( (SELECT SUM(unit_purchase_requests.total_amount) FROM unit_purchase_requests LEFT JOIN procurement_centers AS pc ON unit_purchase_requests.procurement_office  = pc.id WHERE mode_of_procurement  = 'public_bidding' AND programs = procurement_centers.programs AND unit_purchase_requests.status != 'draft' AND unit_purchase_requests.date_prepared >= ?1 AND unit_purchase_requests.date_prepared <= ?2) - (SELECT SUM(po.bid_amount) FROM unit_purchase_requests LEFT JOIN procurement_centers AS pc ON unit_purchase_requests.procurement_office  = pc.id LEFT JOIN purchase_orders AS po ON unit_purchase_requests.id  = po.upr_id WHERE mode_of_procurement  = 'public_bidding' AND programs = procurement_centers.programs AND unit_purchase_requests.status != 'draft' AND unit_purchase_requests.date_prepared >= ?1 AND unit_purchase_requests.date_prepared <= ?2) ) as total_residual, procurement_centers.programs, AVG(unit_purchase_requests.days) as avg_days FROM procurement_centers LEFT JOIN unit_purchase_requests ON unit_purchase_requests.procurement_office = procurement_centers.id LEFT JOIN purchase_orders ON purchase_orders.upr_id = unit_purchase_requests.id GROUP BY procurement_centers.programs", [date_from, date_to], function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('PROCUREMENT_CENTER_PROGRAMS', err)
        }
        commit('PROCUREMENT_CENTER_PROGRAMS', allRows)
      })
    })
  },
  getAlternativePrograms ({ commit }, [date_from, date_to]) {
    // and unit_purchase_requests.units = '$unit_id'
    //strftime('%w', cal_date)
    db.serialize(function () {
      db.all("SELECT  (SELECT COUNT(unit_purchase_requests.id) FROM unit_purchase_requests LEFT JOIN procurement_centers AS pc ON unit_purchase_requests.procurement_office  = pc.id WHERE mode_of_procurement  != 'public_bidding'  AND unit_purchase_requests.status != 'draft' AND programs = procurement_centers.programs AND unit_purchase_requests.date_prepared >= ?1 AND unit_purchase_requests.date_prepared <= ?2) AS upr_count, (SELECT COUNT(unit_purchase_requests.id) FROM unit_purchase_requests LEFT JOIN procurement_centers AS pc on unit_purchase_requests.procurement_office  = pc.id WHERE mode_of_procurement != 'public_bidding' AND programs = procurement_centers.programs AND unit_purchase_requests.date_prepared >= ?1 AND unit_purchase_requests.date_prepared <= ?2 AND unit_purchase_requests.state = 'Cancelled' AND unit_purchase_requests.status != 'draft') AS cancelled_count, IFNULL( (SELECT SUM(CASE WHEN 5 * ( (date('now') - unit_purchase_requests.next_due) / 7) + SUBSTR('0123444401233334012222340111123400001234000123440', 7 * strftime('%w', unit_purchase_requests.next_due) + strftime('%w', date('now')) + 1, 1) > 0 AND unit_purchase_requests.state != 'completed' AND unit_purchase_requests.status != 'draft' AND unit_purchase_requests.state != 'Cancelled' THEN 1 ELSE 0 END) FROM unit_purchase_requests LEFT JOIN procurement_centers AS pc ON unit_purchase_requests.procurement_office = pc.id WHERE mode_of_procurement  != 'public_bidding' AND unit_purchase_requests.next_due <  date('now') AND programs = procurement_centers.programs AND unit_purchase_requests.status != 'draft' AND unit_purchase_requests.date_prepared >= ?1 AND unit_purchase_requests.date_prepared <= ?2 ) ,0 ) AS delay_count, (SELECT COUNT(unit_purchase_requests.id) FROM unit_purchase_requests LEFT JOIN procurement_centers AS pc ON unit_purchase_requests.procurement_office  = pc.id WHERE mode_of_procurement  != 'public_bidding' AND programs = procurement_centers.programs AND unit_purchase_requests.status != 'draft' AND unit_purchase_requests.state = 'completed' AND unit_purchase_requests.date_prepared >= ?1 AND unit_purchase_requests.date_prepared <= ?2) AS completed_count, (SELECT COUNT(unit_purchase_requests.id) FROM unit_purchase_requests LEFT JOIN procurement_centers AS pc ON unit_purchase_requests.procurement_office  = pc.id WHERE mode_of_procurement  != 'public_bidding' AND programs = procurement_centers.programs AND unit_purchase_requests.date_prepared >= ?1 AND unit_purchase_requests.status != 'draft' AND unit_purchase_requests.date_prepared <= ?2 AND unit_purchase_requests.state != 'Cancelled') - (SELECT COUNT(unit_purchase_requests.id) FROM unit_purchase_requests LEFT JOIN procurement_centers AS pc ON unit_purchase_requests.procurement_office  = pc.id WHERE mode_of_procurement != 'public_bidding' AND programs = procurement_centers.programs AND unit_purchase_requests.status != 'draft' AND  unit_purchase_requests.date_prepared >= ?1 AND unit_purchase_requests.date_prepared <= ?2  AND unit_purchase_requests.state != 'Cancelled' AND unit_purchase_requests.state = 'completed') AS ongoing_count, (SELECT SUM(unit_purchase_requests.total_amount) FROM unit_purchase_requests LEFT JOIN procurement_centers AS pc ON unit_purchase_requests.procurement_office  = pc.id WHERE mode_of_procurement  != 'public_bidding' AND programs = procurement_centers.programs AND unit_purchase_requests.status != 'draft' AND unit_purchase_requests.date_prepared >= ?1 AND unit_purchase_requests.date_prepared <= ?2) AS total_abc, (SELECT SUM(po.bid_amount) FROM unit_purchase_requests LEFT JOIN procurement_centers AS pc ON unit_purchase_requests.procurement_office  = pc.id LEFT JOIN purchase_orders AS po ON unit_purchase_requests.id  = po.upr_id WHERE mode_of_procurement  != 'public_bidding' AND programs = procurement_centers.programs AND unit_purchase_requests.status != 'draft' AND unit_purchase_requests.date_prepared >= ?1 AND unit_purchase_requests.date_prepared <= ?2) AS total_bid, ( (SELECT SUM(unit_purchase_requests.total_amount) FROM unit_purchase_requests LEFT JOIN procurement_centers AS pc ON unit_purchase_requests.procurement_office  = pc.id WHERE mode_of_procurement  != 'public_bidding' AND programs = procurement_centers.programs AND unit_purchase_requests.status != 'draft' AND unit_purchase_requests.date_prepared >= ?1 AND unit_purchase_requests.date_prepared <= ?2) - (SELECT SUM(po.bid_amount) FROM unit_purchase_requests LEFT JOIN procurement_centers AS pc ON unit_purchase_requests.procurement_office  = pc.id LEFT JOIN purchase_orders AS po ON unit_purchase_requests.id  = po.upr_id WHERE mode_of_procurement  != 'public_bidding' AND programs = procurement_centers.programs AND unit_purchase_requests.status != 'draft' AND unit_purchase_requests.date_prepared >= ?1 AND unit_purchase_requests.date_prepared <= ?2) ) as total_residual, procurement_centers.programs, AVG(unit_purchase_requests.days) as avg_days FROM procurement_centers LEFT JOIN unit_purchase_requests ON unit_purchase_requests.procurement_office = procurement_centers.id LEFT JOIN purchase_orders ON purchase_orders.upr_id = unit_purchase_requests.id GROUP BY procurement_centers.programs", [date_from, date_to], function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('PROCUREMENT_CENTER_PROGRAMS', err)
        }
        commit('PROCUREMENT_CENTER_PROGRAMS', allRows)
      })
    })
  },
  createProcurement ({ commit }, procurement) {
    commit('PROCUREMENT_CENTER_SQLCreate', ProcurementCenterSQLite.save(procurement))
  },
  syncProcurements ({ commit }, ProcurementCenters) {
    ProcurementCenterResource.all().then(response => {
      commit('PROCUREMENT_CENTER_SQLSync', ProcurementCenterSQLite.syncNew(response.data.data))
    })
  },
  serverProcurementPush ({ commit }) {
    // commit('PROCUREMENT_CENTER_SQLPush', ProcurementCentersQLite.serverPush(ProcurementCenterSQLite.getNew()))
    db.serialize(function () {
      db.all('select * from procurement_centers where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('PROCUREMENT_CENTER_SQLPush', err)
        }
        ProcurementCenterResource.serverPush(allRows)
        commit('PROCUREMENT_CENTER_SQLPush', allRows)
      })
    })
  },
  getProcurements ({ commit }, page = 1) {
    ProcurementCenterResource.all(page).then(response => {
      commit('PROCUREMENT_CENTER_LIST', response.data.data)
    })
  }
}

// getters are functions
const getters = {
  procurementCenters: state => state.procurementCenters,
  programsCenter: state => state.programsCenter
}

export default {
  state,
  getters,
  mutations,
  actions
}
