import UPRResource from '../../api/upr'
import UprSQLite from '../../sqlite/upr'
import { db } from '../../../server/db.js'



const state = {
  uprs: [],
  purpose: [],
  infos: [],
  funds: [],
  uprCenters: [],
  overviewUPR: [],
  uprUnits: [],
  places: []
}

const mutations = {
  UPR_UNITS (state, uprUnits) {
    state.uprUnits = uprUnits
  },
  UPR_OVERVIEW (state, overviewUPR) {
    state.overviewUPR = overviewUPR
  },
  UPR_SQLLIST (state, uprs) {
    state.uprs = uprs
  },
  UPR_LIST (state, uprs) {
    state.uprs = uprs
  },
  UPR_LIST2 (state, uprs) {
    state.uprs = uprs
  },
  UPR_PLACE_List (state, place) {
    state.places = place
  },
  UPR_PURPOSE_List (state, purpose) {
    state.purpose = purpose
  },
  UPR_INFO_List (state, infos) {
    state.infos = infos
  },
  UPR_FUND_List (state, funds) {
    state.funds = funds
  },
  UPR_SQLLIST_CENTER (state, uprCenters) {
    state.uprCenters = uprCenters
  },
  UPR_SQLCreate (state, upr) {
    // state.uprs.push(upr)
  },
  UPR_SQLUpdate (state, upr) {
    state.uprs = upr
  },
  UPR_SQLSync (state, upr) {
    // state.uprs.push(upr)
  },
  UPR_SQLPush (state, upr) {
    // state.uprs.push(upr)
  }
}

const actions = {

  getPSRUprCenters ({ commit }, [program, date_from, date_to]) {
    var data = {}
    db.serialize(function () {
      db.all('SELECT COUNT(unit_purchase_requests.id) AS upr_count, IFNULL( SUM(CASE WHEN 5 * ((date("now") - unit_purchase_requests.next_due) / 7) + SUBSTR("0123444401233334012222340111123400001234000123440", 7 * strftime("%w", unit_purchase_requests.next_due) + strftime("%w", date("now")) + 1, 1) > 0 and unit_purchase_requests.state != "completed" and unit_purchase_requests.next_due <  date("now")  AND unit_purchase_requests.state != "Cancelled" AND unit_purchase_requests.state != "draft" THEN 1 ELSE 0 END),0) AS delay_count, (SELECT COUNT(unit_purchase_requests.id) FROM unit_purchase_requests WHERE mode_of_procurement  = "public_bidding" AND programs = procurement_centers.programs AND unit_purchase_requests.status != "draft" AND unit_purchase_requests.state = "completed" ) AS completed_count, SUM(CASE WHEN unit_purchase_requests.state != "Cancelled" THEN 1 ELSE 0 END) - ( SELECT COUNT(unit_purchase_requests.id) FROM unit_purchase_requests WHERE mode_of_procurement  = "public_bidding" AND programs = procurement_centers.programs AND unit_purchase_requests.status != "draft" AND unit_purchase_requests.state = "completed" ) AS ongoing_count, SUM(CASE WHEN unit_purchase_requests.state = "Cancelled" THEN 1 ELSE 0 END) AS cancelled_count, SUM(unit_purchase_requests.total_amount) AS total_abc, SUM(purchase_orders.bid_amount) AS total_bid, ( SUM(unit_purchase_requests.total_amount) - SUM(purchase_orders.bid_amount)) AS total_residual, AVG(unit_purchase_requests.days) AS avg_days, AVG( unit_purchase_requests.days - 43 ) AS avg_delays, procurement_centers.programs, procurement_centers.name FROM unit_purchase_requests LEFT JOIN procurement_centers ON procurement_centers.id = unit_purchase_requests.procurement_office LEFT JOIN purchase_orders ON purchase_orders.upr_id = unit_purchase_requests.id WHERE procurement_centers.programs = ?1 AND mode_of_procurement = "public_bidding" AND unit_purchase_requests.status != "draft" GROUP BY procurement_centers.programs AND procurement_centers.name ORDER BY delay_count', [program], function (err, allRows) {

        if (err != null) {
          commit('UPR_SQLLIST_CENTER', err)
        }
        data   = {
            'program': program,
            'data': allRows
        }
        console.log(data)
        commit('UPR_SQLLIST_CENTER', data)
      })
    })
  },
  getPSRAlternativeUprCenters ({ commit }, [program, date_from, date_to]) {
    var data = {}
    db.serialize(function () {
      db.all('SELECT COUNT(unit_purchase_requests.id) AS upr_count, IFNULL( SUM(CASE WHEN 5 * ((date("now") - unit_purchase_requests.next_due) / 7) + SUBSTR("0123444401233334012222340111123400001234000123440", 7 * strftime("%w", unit_purchase_requests.next_due) + strftime("%w", date("now")) + 1, 1) > 0 and unit_purchase_requests.state != "completed" and unit_purchase_requests.next_due <  date("now")  AND unit_purchase_requests.state != "Cancelled" AND unit_purchase_requests.state != "draft" THEN 1 ELSE 0 END),0) AS delay_count, (SELECT COUNT(unit_purchase_requests.id) FROM unit_purchase_requests WHERE mode_of_procurement  != "public_bidding" AND programs = procurement_centers.programs AND unit_purchase_requests.status != "draft" AND unit_purchase_requests.state = "completed" ) AS completed_count, SUM(CASE WHEN unit_purchase_requests.state != "Cancelled" THEN 1 ELSE 0 END) - ( SELECT COUNT(unit_purchase_requests.id) FROM unit_purchase_requests WHERE mode_of_procurement  != "public_bidding" AND programs = procurement_centers.programs AND unit_purchase_requests.status != "draft" AND unit_purchase_requests.state = "completed" ) AS ongoing_count, SUM(CASE WHEN unit_purchase_requests.state = "Cancelled" THEN 1 ELSE 0 END) AS cancelled_count, SUM(unit_purchase_requests.total_amount) AS total_abc, SUM(purchase_orders.bid_amount) AS total_bid, ( SUM(unit_purchase_requests.total_amount) - SUM(purchase_orders.bid_amount)) AS total_residual, AVG(unit_purchase_requests.days) AS avg_days, AVG( unit_purchase_requests.days - 43 ) AS avg_delays, procurement_centers.programs, procurement_centers.name FROM unit_purchase_requests LEFT JOIN procurement_centers ON procurement_centers.id = unit_purchase_requests.procurement_office LEFT JOIN purchase_orders ON purchase_orders.upr_id = unit_purchase_requests.id WHERE procurement_centers.programs = ?1 AND mode_of_procurement != "public_bidding" AND unit_purchase_requests.status != "draft" GROUP BY procurement_centers.programs AND procurement_centers.name ORDER BY delay_count', [program], function (err, allRows) {
        if (err != null) {
          commit('UPR_SQLLIST_CENTER', err)
        }
        data   = {
            'program': program,
            'data': allRows
        }
        commit('UPR_SQLLIST_CENTER', data)
      })
    })
  },
  getUPRUnits ({ commit }, [center, program, date_from, date_to]) {
    var data = {}
    db.serialize(function () {
      db.all('SELECT COUNT(unit_purchase_requests.id) AS upr_count, IFNULL( SUM(CASE WHEN 5 * ((date("now") - unit_purchase_requests.next_due) / 7) + SUBSTR("0123444401233334012222340111123400001234000123440", 7 * strftime("%w", unit_purchase_requests.next_due) + strftime("%w", date("now")) + 1, 1) > 0 AND unit_purchase_requests.state != "completed" AND unit_purchase_requests.next_due <  date("now")  AND unit_purchase_requests.state != "Cancelled" AND unit_purchase_requests.state != "draft" THEN 1 ELSE 0 END),0) AS delay_count, (SELECT COUNT(unit_purchase_requests.id) FROM unit_purchase_requests WHERE mode_of_procurement  = "public_bidding" AND programs = procurement_centers.programs AND unit_purchase_requests.status != "draft" AND unit_purchase_requests.state = "completed" ) AS completed_count, SUM(CASE WHEN unit_purchase_requests.state != "Cancelled" THEN 1 ELSE 0 END) - ( SELECT COUNT(unit_purchase_requests.id) FROM unit_purchase_requests WHERE mode_of_procurement  = "public_bidding" AND programs = procurement_centers.programs AND unit_purchase_requests.status != "draft" AND unit_purchase_requests.state = "completed" ) AS ongoing_count, SUM(CASE WHEN unit_purchase_requests.state = "Cancelled" THEN 1 ELSE 0 END) AS cancelled_count, SUM(unit_purchase_requests.total_amount) AS total_abc, SUM(purchase_orders.bid_amount) AS total_bid, ( SUM(unit_purchase_requests.total_amount) - SUM(purchase_orders.bid_amount)) AS total_residual, AVG(unit_purchase_requests.days) AS avg_days, AVG( unit_purchase_requests.days - 43 ) AS avg_delays, procurement_centers.name, procurement_centers.programs, catered_units.short_code FROM unit_purchase_requests LEFT JOIN purchase_orders ON purchase_orders.upr_id = unit_purchase_requests.id LEFT JOIN procurement_centers ON procurement_centers.id = unit_purchase_requests.procurement_office LEFT JOIN catered_units ON catered_units.id = unit_purchase_requests.units WHERE procurement_centers.name = ?1 AND procurement_centers.programs = ?2 AND mode_of_procurement = "public_bidding" AND unit_purchase_requests.status != "draft" GROUP BY procurement_centers.name AND procurement_centers.programs AND catered_units.short_code ORDER BY delay_count  AND ongoing_count  ',[center, program] , function (err, allRows) {
        if (err != null) {
          commit('UPR_UNITS', err)
        }
        data   = {
            'program': program,
            'center': center,
            'data': allRows
        }
        commit('UPR_UNITS', data)
      })
    })
  },
  getOverviewUPRs ({ commit }, [short_code, name, date_from, date_to]) {
    var data = {}
    db.serialize(function () {
      db.all('SELECT COUNT(unit_purchase_requests.id) AS upr_count, IFNULL( SUM(CASE WHEN 5 * ((date("now") - unit_purchase_requests.next_due) / 7) + SUBSTR("0123444401233334012222340111123400001234000123440", 7 * strftime("%w", unit_purchase_requests.next_due) + strftime("%w", date("now")) + 1, 1) > 0 AND unit_purchase_requests.state != "completed" AND unit_purchase_requests.next_due <  date("now")  AND unit_purchase_requests.state != "Cancelled" AND unit_purchase_requests.state != "draft" THEN 1 ELSE 0 END),0) AS delay_count, (SELECT COUNT(unit_purchase_requests.id) FROM unit_purchase_requests WHERE mode_of_procurement  = "public_bidding" AND programs = procurement_centers.programs AND unit_purchase_requests.status != "draft" AND unit_purchase_requests.state = "completed" ) AS completed_count, SUM(CASE WHEN unit_purchase_requests.state != "Cancelled" THEN 1 ELSE 0 END) - ( SELECT COUNT(unit_purchase_requests.id) FROM unit_purchase_requests WHERE mode_of_procurement  = "public_bidding" AND programs = procurement_centers.programs AND unit_purchase_requests.status != "draft" AND unit_purchase_requests.state = "completed" ) AS ongoing_count,SUM(unit_purchase_requests.total_amount) AS total_abc, SUM(purchase_orders.bid_amount) AS total_bid, ( SUM(unit_purchase_requests.total_amount) - SUM(purchase_orders.bid_amount)) AS total_residual, AVG(unit_purchase_requests.days) AS avg_days, AVG( unit_purchase_requests.days - 43 ) AS avg_delays, procurement_centers.name, procurement_centers.programs, unit_purchase_requests.upr_number, unit_purchase_requests.project_name, unit_purchase_requests.id, unit_purchase_requests.status, unit_purchase_requests.last_remarks, unit_purchase_requests.last_action, unit_purchase_requests.next_due, catered_units.short_code, (5 * ((date("now") - unit_purchase_requests.next_due) / 7) + SUBSTR("0123444401233334012222340111123400001234000123440", 7 * strftime("%w", unit_purchase_requests.next_due) + strftime("%w", date("now")) + 1, 1)) AS delay FROM unit_purchase_requests LEFT JOIN purchase_orders ON purchase_orders.upr_id = unit_purchase_requests.id LEFT JOIN vouchers ON vouchers.upr_id = unit_purchase_requests.id LEFT JOIN procurement_centers ON procurement_centers.id = unit_purchase_requests.procurement_office LEFT JOIN catered_units ON catered_units.id = unit_purchase_requests.units WHERE mode_of_procurement = "public_bidding" AND unit_purchase_requests.status != "draft" AND procurement_centers.name = ?1 AND catered_units.short_code = ?2 GROUP BY procurement_centers.name AND unit_purchase_requests.next_due AND procurement_centers.programs AND unit_purchase_requests.upr_number AND unit_purchase_requests.next_due AND unit_purchase_requests.delay_count AND unit_purchase_requests.status AND catered_units.short_code AND unit_purchase_requests.last_remarks AND unit_purchase_requests.last_action AND unit_purchase_requests.project_name AND unit_purchase_requests.id AND unit_purchase_requests.date_prepared AND vouchers.preaudit_date',[name, short_code] , function (err, allRows) {

        if (err != null) {
          commit('UPR_OVERVIEW', err)
        }
        data   = {
            'program': name,
            'center': short_code,
            'data': allRows
        }
        commit('UPR_OVERVIEW', data)
      })
    })
  },
  getAlternativeOverviewUPRs ({ commit }, [short_code, name, date_from, date_to]) {
    var data = {}
    db.serialize(function () {
      db.all('SELECT COUNT(unit_purchase_requests.id) AS upr_count, IFNULL( SUM(CASE WHEN 5 * ((date("now") - unit_purchase_requests.next_due) / 7) + SUBSTR("0123444401233334012222340111123400001234000123440", 7 * strftime("%w", unit_purchase_requests.next_due) + strftime("%w", date("now")) + 1, 1) > 0 AND unit_purchase_requests.state != "completed" AND unit_purchase_requests.next_due <  date("now")  AND unit_purchase_requests.state != "Cancelled" AND unit_purchase_requests.state != "draft" THEN 1 ELSE 0 END),0) AS delay_count, (SELECT COUNT(unit_purchase_requests.id) FROM unit_purchase_requests WHERE mode_of_procurement  != "public_bidding" AND programs = procurement_centers.programs AND unit_purchase_requests.status != "draft" AND unit_purchase_requests.state = "completed" ) AS completed_count, SUM(CASE WHEN unit_purchase_requests.state != "Cancelled" THEN 1 ELSE 0 END) - ( SELECT COUNT(unit_purchase_requests.id) FROM unit_purchase_requests WHERE mode_of_procurement  != "public_bidding" AND programs = procurement_centers.programs AND unit_purchase_requests.status != "draft" AND unit_purchase_requests.state = "completed" ) AS ongoing_count,SUM(unit_purchase_requests.total_amount) AS total_abc, SUM(purchase_orders.bid_amount) AS total_bid, ( SUM(unit_purchase_requests.total_amount) - SUM(purchase_orders.bid_amount)) AS total_residual, AVG(unit_purchase_requests.days) AS avg_days, AVG( unit_purchase_requests.days - 43 ) AS avg_delays, procurement_centers.name, procurement_centers.programs, unit_purchase_requests.upr_number, unit_purchase_requests.project_name, unit_purchase_requests.id, unit_purchase_requests.status, unit_purchase_requests.last_remarks, unit_purchase_requests.last_action, unit_purchase_requests.next_due, catered_units.short_code, (5 * ((date("now") - unit_purchase_requests.next_due) / 7) + SUBSTR("0123444401233334012222340111123400001234000123440", 7 * strftime("%w", unit_purchase_requests.next_due) + strftime("%w", date("now")) + 1, 1)) AS delay FROM unit_purchase_requests LEFT JOIN purchase_orders ON purchase_orders.upr_id = unit_purchase_requests.id LEFT JOIN vouchers ON vouchers.upr_id = unit_purchase_requests.id LEFT JOIN procurement_centers ON procurement_centers.id = unit_purchase_requests.procurement_office LEFT JOIN catered_units ON catered_units.id = unit_purchase_requests.units WHERE mode_of_procurement != "public_bidding" AND unit_purchase_requests.status != "draft" AND procurement_centers.name = ?1 AND catered_units.short_code = ?2 GROUP BY procurement_centers.name AND unit_purchase_requests.next_due AND procurement_centers.programs AND unit_purchase_requests.upr_number AND unit_purchase_requests.next_due AND unit_purchase_requests.delay_count AND unit_purchase_requests.status AND catered_units.short_code AND unit_purchase_requests.last_remarks AND unit_purchase_requests.last_action AND unit_purchase_requests.project_name AND unit_purchase_requests.id AND unit_purchase_requests.date_prepared AND vouchers.preaudit_date',[name, short_code] , function (err, allRows) {
        console.log(err)
        console.log(allRows)
        if (err != null) {
          commit('UPR_OVERVIEW', err)
        }
        data   = {
            'program': name,
            'center': short_code,
            'data': allRows
        }
        commit('UPR_OVERVIEW', data)
      })
    })
  },
  getAlternativeUPRUnits ({ commit }, [center, program, date_from, date_to]) {
    var data = {}
    db.serialize(function () {
      db.all('SELECT COUNT(unit_purchase_requests.id) AS upr_count, IFNULL( SUM(CASE WHEN 5 * ((date("now") - unit_purchase_requests.next_due) / 7) + SUBSTR("0123444401233334012222340111123400001234000123440", 7 * strftime("%w", unit_purchase_requests.next_due) + strftime("%w", date("now")) + 1, 1) > 0 AND unit_purchase_requests.state != "completed" AND unit_purchase_requests.next_due <  date("now")  AND unit_purchase_requests.state != "Cancelled" AND unit_purchase_requests.state != "draft" THEN 1 ELSE 0 END),0) AS delay_count, (SELECT COUNT(unit_purchase_requests.id) FROM unit_purchase_requests WHERE mode_of_procurement  != "public_bidding" AND programs = procurement_centers.programs AND unit_purchase_requests.status != "draft" AND unit_purchase_requests.state = "completed" ) AS completed_count, SUM(CASE WHEN unit_purchase_requests.state != "Cancelled" THEN 1 ELSE 0 END) - ( SELECT COUNT(unit_purchase_requests.id) FROM unit_purchase_requests WHERE mode_of_procurement  != "public_bidding" AND programs = procurement_centers.programs AND unit_purchase_requests.status != "draft" AND unit_purchase_requests.state = "completed" ) AS ongoing_count, SUM(CASE WHEN unit_purchase_requests.state = "Cancelled" THEN 1 ELSE 0 END) AS cancelled_count, SUM(unit_purchase_requests.total_amount) AS total_abc, SUM(purchase_orders.bid_amount) AS total_bid, ( SUM(unit_purchase_requests.total_amount) - SUM(purchase_orders.bid_amount)) AS total_residual, AVG(unit_purchase_requests.days) AS avg_days, AVG( unit_purchase_requests.days - 43 ) AS avg_delays, procurement_centers.name, procurement_centers.programs,catered_units.short_code FROM unit_purchase_requests LEFT JOIN purchase_orders ON purchase_orders.upr_id = unit_purchase_requests.id LEFT JOIN procurement_centers ON procurement_centers.id = unit_purchase_requests.procurement_office LEFT JOIN catered_units ON catered_units.id = unit_purchase_requests.units WHERE procurement_centers.name = ?1 AND procurement_centers.programs = ?2 AND mode_of_procurement != "public_bidding" AND unit_purchase_requests.status != "draft" GROUP BY procurement_centers.name AND procurement_centers.programs AND catered_units.short_code ORDER BY delay_count  AND ongoing_count  ',[center, program] , function (err, allRows) {
        if (err != null) {
          commit('UPR_UNITS', err)
        }
        data   = {
            'program': program,
            'center': center,
            'data': allRows
        }
        commit('UPR_UNITS', data)
      })
    })
  },
  listUprs ({ commit }, [page = 0, q = ""]) {
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select unit_purchase_requests.*, procurement_types.code as type, mode_of_procurements.name as modes, payment_terms.name as terms, chargeability.name as charge from unit_purchase_requests LEFT JOIN procurement_centers ON procurement_centers.id = unit_purchase_requests.procurement_office LEFT JOIN mode_of_procurements ON mode_of_procurements.id = unit_purchase_requests.mode_of_procurement LEFT JOIN payment_terms ON payment_terms.id = unit_purchase_requests.terms_of_payment LEFT JOIN procurement_types ON procurement_types.id = unit_purchase_requests.procurement_type LEFT JOIN chargeability ON chargeability.id = unit_purchase_requests.chargeability WHERE mode_of_procurement != "public_bidding" AND status != "draft" AND status != "Cancelled" AND (project_name LIKE ?1 OR chargeability.name LIKE ?1 OR upr_number LIKE ?1 OR place_of_delivery LIKE ?1 OR date_prepared LIKE ?1 OR procurement_types.code LIKE ?1 OR purpose LIKE ?1 OR other_infos LIKE ?1 OR payment_terms.name LIKE ?1 ) limit 20 offset ' + page, {1: query}, function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('UPR_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('UPR_SQLLIST', data)
      })
    })
  },
  listCancelledUprs ({ commit }, [page = 0, q = ""]) {
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select unit_purchase_requests.*, procurement_types.code as type, purchase_orders.bid_amount, procurement_centers.name as centers, mode_of_procurements.name as modes, payment_terms.name as terms, chargeability.name as charge from unit_purchase_requests LEFT JOIN procurement_centers ON procurement_centers.id = unit_purchase_requests.procurement_office LEFT JOIN mode_of_procurements ON mode_of_procurements.id = unit_purchase_requests.mode_of_procurement LEFT JOIN payment_terms ON payment_terms.id = unit_purchase_requests.terms_of_payment LEFT JOIN purchase_orders ON purchase_orders.upr_id = unit_purchase_requests.id LEFT JOIN procurement_types ON procurement_types.id = unit_purchase_requests.procurement_type LEFT JOIN chargeability ON chargeability.id = unit_purchase_requests.chargeability WHERE mode_of_procurement != "public_bidding" AND unit_purchase_requests.status = "Cancelled" AND (project_name LIKE ?1 OR chargeability.name LIKE ?1 OR unit_purchase_requests.upr_number LIKE ?1 OR place_of_delivery LIKE ?1 OR date_prepared LIKE ?1 OR procurement_types.code LIKE ?1 OR purpose LIKE ?1 OR other_infos LIKE ?1 OR payment_terms.name LIKE ?1 ) limit 20 offset ' + page, {1: query}, function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('UPR_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('UPR_SQLLIST', data)
      })
    })
  },
  listBidCancelledUprs ({ commit }, [page = 0, q = ""]) {
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select unit_purchase_requests.*, procurement_centers.name as centers, purchase_orders.bid_amount, procurement_types.code as type, mode_of_procurements.name as modes, payment_terms.name as terms, chargeability.name as charge from unit_purchase_requests LEFT JOIN procurement_centers ON procurement_centers.id = unit_purchase_requests.procurement_office LEFT JOIN purchase_orders ON purchase_orders.upr_id = unit_purchase_requests.id LEFT JOIN mode_of_procurements ON mode_of_procurements.id = unit_purchase_requests.mode_of_procurement LEFT JOIN payment_terms ON payment_terms.id = unit_purchase_requests.terms_of_payment LEFT JOIN procurement_types ON procurement_types.id = unit_purchase_requests.procurement_type LEFT JOIN chargeability ON chargeability.id = unit_purchase_requests.chargeability WHERE mode_of_procurement = "public_bidding" AND unit_purchase_requests.status = "Cancelled" AND (project_name LIKE ?1 OR chargeability.name LIKE ?1 OR unit_purchase_requests.upr_number LIKE ?1 OR place_of_delivery LIKE ?1 OR date_prepared LIKE ?1 OR procurement_types.code LIKE ?1 OR purpose LIKE ?1 OR other_infos LIKE ?1 OR payment_terms.name LIKE ?1 ) limit 20 offset ' + page, {1: query}, function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('UPR_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('UPR_SQLLIST', data)
      })
    })
  },
  listOverviewUprs ({ commit }, [programs, pcco = "", unitCode = "", page = 0, q = ""]) {
    var data = {}
    var query  =  "%"+ q +"%"
    var pccos  =  "%"+ pcco +"%"
    var unitCodes  =  "%"+ unitCode +"%"
    db.serialize(function () {
      db.all('select  purchase_orders.bid_amount, unit_purchase_requests.*, procurement_types.code as type, mode_of_procurements.name as modes, payment_terms.name as terms, procurement_centers.name as centers, chargeability.name as charge from unit_purchase_requests LEFT JOIN procurement_centers ON procurement_centers.id = unit_purchase_requests.procurement_office LEFT JOIN mode_of_procurements ON mode_of_procurements.id = unit_purchase_requests.mode_of_procurement LEFT JOIN purchase_orders ON purchase_orders.upr_id = unit_purchase_requests.id LEFT JOIN payment_terms ON payment_terms.id = unit_purchase_requests.terms_of_payment LEFT JOIN procurement_types ON procurement_types.id = unit_purchase_requests.procurement_type LEFT JOIN catered_units ON catered_units.id = unit_purchase_requests.units LEFT JOIN chargeability ON chargeability.id = unit_purchase_requests.chargeability WHERE procurement_centers.programs = ?2 AND procurement_centers.name LIKE ?3 AND catered_units.short_code LIKE ?4 AND mode_of_procurement != "public_bidding" AND unit_purchase_requests.status != "draft" AND (project_name LIKE ?1 OR chargeability.name LIKE ?1 OR unit_purchase_requests.upr_number LIKE ?1 OR place_of_delivery LIKE ?1 OR date_prepared LIKE ?1 OR procurement_types.code LIKE ?1 OR purpose LIKE ?1 OR other_infos LIKE ?1 OR payment_terms.name LIKE ?1 ) AND (5 * ((date("now") - unit_purchase_requests.next_due) / 7) + SUBSTR("0123444401233334012222340111123400001234000123440", 7 * strftime("%w", unit_purchase_requests.next_due) + strftime("%w", date("now")) + 1, 1) - (SELECT COUNT(*) FROM holidays WHERE holiday_date >= unit_purchase_requests.date_prepared and holiday_date <= (date("now") AND strftime("%w", holiday_date) < 6 ) ) ) > 0 AND unit_purchase_requests.next_due <  date("now")  limit 20 offset ' + page, {1: query, 2:programs, 3: pccos, 4: unitCodes}, function (err, allRows) {
        console.log(allRows)
        if (err != null) {
          console.log(err)
          commit('UPR_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('UPR_SQLLIST', data)

      })
    })
  },
  listOverviewCompletedUprs ({ commit }, [programs, pcco = "", unitCode = "", page = 0, q = ""]) {
    var data = {}
    var query  =  "%"+ q +"%"
    var pccos  =  "%"+ pcco +"%"
    var unitCodes  =  "%"+ unitCode +"%"
    db.serialize(function () {
      db.all('select  purchase_orders.bid_amount, unit_purchase_requests.*, procurement_types.code as type, mode_of_procurements.name as modes, payment_terms.name as terms, procurement_centers.name as centers, chargeability.name as charge from unit_purchase_requests LEFT JOIN procurement_centers ON procurement_centers.id = unit_purchase_requests.procurement_office LEFT JOIN mode_of_procurements ON mode_of_procurements.id = unit_purchase_requests.mode_of_procurement LEFT JOIN purchase_orders ON purchase_orders.upr_id = unit_purchase_requests.id LEFT JOIN payment_terms ON payment_terms.id = unit_purchase_requests.terms_of_payment LEFT JOIN procurement_types ON procurement_types.id = unit_purchase_requests.procurement_type LEFT JOIN catered_units ON catered_units.id = unit_purchase_requests.units LEFT JOIN chargeability ON chargeability.id = unit_purchase_requests.chargeability WHERE procurement_centers.programs = ?2 AND procurement_centers.name LIKE ?3 AND catered_units.short_code LIKE ?4 AND mode_of_procurement != "public_bidding" AND unit_purchase_requests.status != "draft" AND unit_purchase_requests.status = "completed" AND (project_name LIKE ?1 OR chargeability.name LIKE ?1 OR unit_purchase_requests.upr_number LIKE ?1 OR place_of_delivery LIKE ?1 OR date_prepared LIKE ?1 OR procurement_types.code LIKE ?1 OR purpose LIKE ?1 OR other_infos LIKE ?1 OR payment_terms.name LIKE ?1 ) AND (5 * ((date("now") - unit_purchase_requests.next_due) / 7) + SUBSTR("0123444401233334012222340111123400001234000123440", 7 * strftime("%w", unit_purchase_requests.next_due) + strftime("%w", date("now")) + 1, 1) - (SELECT COUNT(*) FROM holidays WHERE holiday_date >= unit_purchase_requests.date_prepared and holiday_date <= (date("now") AND strftime("%w", holiday_date) < 6 ) ) ) > 0 AND unit_purchase_requests.next_due <  date("now")  limit 20 offset ' + page, {1: query, 2:programs, 3: pccos, 4: unitCodes}, function (err, allRows) {
        console.log(allRows)
        if (err != null) {
          console.log(err)
          commit('UPR_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('UPR_SQLLIST', data)

      })
    })
  },
  listOverviewOngoingUprs ({ commit }, [programs, pcco = "", unitCode = "", page = 0, q = ""]) {
    var data = {}
    var query  =  "%"+ q +"%"
    var pccos  =  "%"+ pcco +"%"
    var unitCodes  =  "%"+ unitCode +"%"
    db.serialize(function () {
      db.all('select  purchase_orders.bid_amount, unit_purchase_requests.*, procurement_types.code as type, mode_of_procurements.name as modes, payment_terms.name as terms, procurement_centers.name as centers, chargeability.name as charge from unit_purchase_requests LEFT JOIN procurement_centers ON procurement_centers.id = unit_purchase_requests.procurement_office LEFT JOIN mode_of_procurements ON mode_of_procurements.id = unit_purchase_requests.mode_of_procurement LEFT JOIN purchase_orders ON purchase_orders.upr_id = unit_purchase_requests.id LEFT JOIN payment_terms ON payment_terms.id = unit_purchase_requests.terms_of_payment LEFT JOIN procurement_types ON procurement_types.id = unit_purchase_requests.procurement_type LEFT JOIN catered_units ON catered_units.id = unit_purchase_requests.units LEFT JOIN chargeability ON chargeability.id = unit_purchase_requests.chargeability WHERE procurement_centers.programs = ?2 AND procurement_centers.name LIKE ?3 AND catered_units.short_code LIKE ?4 AND mode_of_procurement != "public_bidding" AND unit_purchase_requests.status != "draft" AND unit_purchase_requests.status != "completed" AND unit_purchase_requests.status != "Cancelled" AND (project_name LIKE ?1 OR chargeability.name LIKE ?1 OR unit_purchase_requests.upr_number LIKE ?1 OR place_of_delivery LIKE ?1 OR date_prepared LIKE ?1 OR procurement_types.code LIKE ?1 OR purpose LIKE ?1 OR other_infos LIKE ?1 OR payment_terms.name LIKE ?1 ) AND (5 * ((date("now") - unit_purchase_requests.next_due) / 7) + SUBSTR("0123444401233334012222340111123400001234000123440", 7 * strftime("%w", unit_purchase_requests.next_due) + strftime("%w", date("now")) + 1, 1) - (SELECT COUNT(*) FROM holidays WHERE holiday_date >= unit_purchase_requests.date_prepared and holiday_date <= (date("now") AND strftime("%w", holiday_date) < 6 ) ) ) > 0 AND unit_purchase_requests.next_due <  date("now")  limit 20 offset ' + page, {1: query, 2:programs, 3: pccos, 4: unitCodes}, function (err, allRows) {
        console.log(allRows)
        if (err != null) {
          console.log(err)
          commit('UPR_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('UPR_SQLLIST', data)

      })
    })
  },
  listOverviewCancelledUprs ({ commit }, [programs, pcco = "", unitCode = "", page = 0, q = ""]) {
    var data = {}
    var query  =  "%"+ q +"%"
    var pccos  =  "%"+ pcco +"%"
    var unitCodes  =  "%"+ unitCode +"%"
    db.serialize(function () {
      db.all('select  purchase_orders.bid_amount, unit_purchase_requests.*, procurement_types.code as type, mode_of_procurements.name as modes, payment_terms.name as terms, procurement_centers.name as centers, chargeability.name as charge from unit_purchase_requests LEFT JOIN procurement_centers ON procurement_centers.id = unit_purchase_requests.procurement_office LEFT JOIN mode_of_procurements ON mode_of_procurements.id = unit_purchase_requests.mode_of_procurement LEFT JOIN purchase_orders ON purchase_orders.upr_id = unit_purchase_requests.id LEFT JOIN payment_terms ON payment_terms.id = unit_purchase_requests.terms_of_payment LEFT JOIN procurement_types ON procurement_types.id = unit_purchase_requests.procurement_type LEFT JOIN catered_units ON catered_units.id = unit_purchase_requests.units LEFT JOIN chargeability ON chargeability.id = unit_purchase_requests.chargeability WHERE procurement_centers.programs = ?2 AND procurement_centers.name LIKE ?3 AND catered_units.short_code LIKE ?4 AND mode_of_procurement != "public_bidding" AND unit_purchase_requests.status != "draft" AND unit_purchase_requests.status = "Cancelled" AND (project_name LIKE ?1 OR chargeability.name LIKE ?1 OR unit_purchase_requests.upr_number LIKE ?1 OR place_of_delivery LIKE ?1 OR date_prepared LIKE ?1 OR procurement_types.code LIKE ?1 OR purpose LIKE ?1 OR other_infos LIKE ?1 OR payment_terms.name LIKE ?1 ) AND (5 * ((date("now") - unit_purchase_requests.next_due) / 7) + SUBSTR("0123444401233334012222340111123400001234000123440", 7 * strftime("%w", unit_purchase_requests.next_due) + strftime("%w", date("now")) + 1, 1) - (SELECT COUNT(*) FROM holidays WHERE holiday_date >= unit_purchase_requests.date_prepared and holiday_date <= (date("now") AND strftime("%w", holiday_date) < 6 ) ) ) > 0 AND unit_purchase_requests.next_due <  date("now")  limit 20 offset ' + page, {1: query, 2:programs, 3: pccos, 4: unitCodes}, function (err, allRows) {
        console.log(allRows)
        if (err != null) {
          console.log(err)
          commit('UPR_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('UPR_SQLLIST', data)

      })
    })
  },
  listBidOverviewUprs ({ commit }, [programs, pcco = "", unitCode = "", page = 0, q = ""]) {
    console.log(programs)
    var data = {}
    var query  =  "%"+ q +"%"
    var pccos  =  "%"+ pcco +"%"
    var unitCodes  =  "%"+ unitCode +"%"
    db.serialize(function () {
      db.all('select unit_purchase_requests.*, procurement_types.code as type, purchase_orders.bid_amount, mode_of_procurements.name as modes, payment_terms.name as terms, procurement_centers.name as centers, chargeability.name as charge from unit_purchase_requests LEFT JOIN procurement_centers ON procurement_centers.id = unit_purchase_requests.procurement_office LEFT JOIN purchase_orders ON purchase_orders.upr_id = unit_purchase_requests.id LEFT JOIN mode_of_procurements ON mode_of_procurements.id = unit_purchase_requests.mode_of_procurement LEFT JOIN payment_terms ON payment_terms.id = unit_purchase_requests.terms_of_payment LEFT JOIN procurement_types ON procurement_types.id = unit_purchase_requests.procurement_type LEFT JOIN catered_units ON catered_units.id = unit_purchase_requests.units LEFT JOIN chargeability ON chargeability.id = unit_purchase_requests.chargeability WHERE procurement_centers.programs = ?2 AND procurement_centers.name LIKE ?3 AND catered_units.short_code LIKE ?4 AND mode_of_procurement = "public_bidding" AND unit_purchase_requests.status != "draft" AND (project_name LIKE ?1 OR chargeability.name LIKE ?1 OR unit_purchase_requests.upr_number LIKE ?1 OR place_of_delivery LIKE ?1 OR date_prepared LIKE ?1 OR procurement_types.code LIKE ?1 OR purpose LIKE ?1 OR other_infos LIKE ?1 OR payment_terms.name LIKE ?1 ) limit 20 offset ' + page, {1: query, 2:programs, 3: pccos, 4: unitCodes}, function (err, allRows) {
        console.log(allRows)
        if (err != null) {
          console.log(err)
          commit('UPR_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('UPR_SQLLIST', data)
      })
    })
  },
  listBidOverviewCompletedUprs ({ commit }, [programs, pcco = "", unitCode = "", page = 0, q = ""]) {
    console.log(programs)
    var data = {}
    var query  =  "%"+ q +"%"
    var pccos  =  "%"+ pcco +"%"
    var unitCodes  =  "%"+ unitCode +"%"
    db.serialize(function () {
      db.all('select unit_purchase_requests.*, procurement_types.code as type, purchase_orders.bid_amount, mode_of_procurements.name as modes, payment_terms.name as terms, procurement_centers.name as centers, chargeability.name as charge from unit_purchase_requests LEFT JOIN procurement_centers ON procurement_centers.id = unit_purchase_requests.procurement_office LEFT JOIN purchase_orders ON purchase_orders.upr_id = unit_purchase_requests.id LEFT JOIN mode_of_procurements ON mode_of_procurements.id = unit_purchase_requests.mode_of_procurement LEFT JOIN payment_terms ON payment_terms.id = unit_purchase_requests.terms_of_payment LEFT JOIN procurement_types ON procurement_types.id = unit_purchase_requests.procurement_type LEFT JOIN catered_units ON catered_units.id = unit_purchase_requests.units LEFT JOIN chargeability ON chargeability.id = unit_purchase_requests.chargeability WHERE procurement_centers.programs = ?2 AND procurement_centers.name LIKE ?3 AND catered_units.short_code LIKE ?4 AND mode_of_procurement = "public_bidding" AND unit_purchase_requests.status = "completed" AND unit_purchase_requests.status != "draft" AND (project_name LIKE ?1 OR chargeability.name LIKE ?1 OR unit_purchase_requests.upr_number LIKE ?1 OR place_of_delivery LIKE ?1 OR date_prepared LIKE ?1 OR procurement_types.code LIKE ?1 OR purpose LIKE ?1 OR other_infos LIKE ?1 OR payment_terms.name LIKE ?1 ) limit 20 offset ' + page, {1: query, 2:programs, 3: pccos, 4: unitCodes}, function (err, allRows) {
        console.log(allRows)
        if (err != null) {
          console.log(err)
          commit('UPR_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('UPR_SQLLIST', data)
      })
    })
  },
  listBidOverviewOngoingUprs ({ commit }, [programs, pcco = "", unitCode = "", page = 0, q = ""]) {
    console.log(programs)
    var data = {}
    var query  =  "%"+ q +"%"
    var pccos  =  "%"+ pcco +"%"
    var unitCodes  =  "%"+ unitCode +"%"
    db.serialize(function () {
      db.all('select unit_purchase_requests.*, purchase_orders.bid_amount, procurement_types.code as type, mode_of_procurements.name as modes, payment_terms.name as terms, procurement_centers.name as centers, chargeability.name as charge from unit_purchase_requests LEFT JOIN procurement_centers ON procurement_centers.id = unit_purchase_requests.procurement_office LEFT JOIN purchase_orders ON purchase_orders.upr_id = unit_purchase_requests.id LEFT JOIN mode_of_procurements ON mode_of_procurements.id = unit_purchase_requests.mode_of_procurement LEFT JOIN payment_terms ON payment_terms.id = unit_purchase_requests.terms_of_payment LEFT JOIN procurement_types ON procurement_types.id = unit_purchase_requests.procurement_type LEFT JOIN catered_units ON catered_units.id = unit_purchase_requests.units LEFT JOIN chargeability ON chargeability.id = unit_purchase_requests.chargeability WHERE procurement_centers.programs = ?2 AND procurement_centers.name LIKE ?3 AND catered_units.short_code LIKE ?4 AND mode_of_procurement = "public_bidding" AND unit_purchase_requests.status != "draft" AND unit_purchase_requests.status != "completed" AND unit_purchase_requests.status != "Cancelled"  AND (project_name LIKE ?1 OR chargeability.name LIKE ?1 OR unit_purchase_requests.upr_number LIKE ?1 OR place_of_delivery LIKE ?1 OR date_prepared LIKE ?1 OR procurement_types.code LIKE ?1 OR purpose LIKE ?1 OR other_infos LIKE ?1 OR payment_terms.name LIKE ?1 ) limit 20 offset ' + page, {1: query, 2:programs, 3: pccos, 4: unitCodes}, function (err, allRows) {
        console.log(allRows)
        if (err != null) {
          console.log(err)
          commit('UPR_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('UPR_SQLLIST', data)
      })
    })
  },
  listBidOverviewCancelledUprs ({ commit }, [programs, pcco = "", unitCode = "", page = 0, q = ""]) {
    console.log(programs)
    var data = {}
    var query  =  "%"+ q +"%"
    var pccos  =  "%"+ pcco +"%"
    var unitCodes  =  "%"+ unitCode +"%"
    db.serialize(function () {
      db.all('select unit_purchase_requests.*, procurement_types.code as type, purchase_orders.bid_amount, mode_of_procurements.name as modes, payment_terms.name as terms, chargeability.name as charge from unit_purchase_requests LEFT JOIN procurement_centers ON procurement_centers.id = unit_purchase_requests.procurement_office LEFT JOIN purchase_orders ON purchase_orders.upr_id = unit_purchase_requests.id LEFT JOIN mode_of_procurements ON mode_of_procurements.id = unit_purchase_requests.mode_of_procurement LEFT JOIN payment_terms ON payment_terms.id = unit_purchase_requests.terms_of_payment LEFT JOIN procurement_types ON procurement_types.id = unit_purchase_requests.procurement_type LEFT JOIN catered_units ON catered_units.id = unit_purchase_requests.units LEFT JOIN chargeability ON chargeability.id = unit_purchase_requests.chargeability WHERE procurement_centers.programs = ?2 AND procurement_centers.name LIKE ?3 AND catered_units.short_code LIKE ?4 AND mode_of_procurement = "public_bidding" AND unit_purchase_requests.status != "draft" AND unit_purchase_requests.status = "Cancelled" AND (project_name LIKE ?1 OR chargeability.name LIKE ?1 OR unit_purchase_requests.upr_number LIKE ?1 OR place_of_delivery LIKE ?1 OR date_prepared LIKE ?1 OR procurement_types.code LIKE ?1 OR purpose LIKE ?1 OR other_infos LIKE ?1 OR payment_terms.name LIKE ?1 ) limit 20 offset ' + page, {1: query, 2:programs, 3: pccos, 4: unitCodes}, function (err, allRows) {
        console.log(allRows)
        if (err != null) {
          console.log(err)
          commit('UPR_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('UPR_SQLLIST', data)
      })
    })
  },
  listDraftUprs ({ commit }, [page = 0, q = ""]) {
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select unit_purchase_requests.*, procurement_types.code as type, payment_terms.name as terms, chargeability.name as charge from unit_purchase_requests LEFT JOIN procurement_centers ON procurement_centers.id = unit_purchase_requests.procurement_office LEFT JOIN payment_terms ON payment_terms.id = unit_purchase_requests.terms_of_payment LEFT JOIN procurement_types ON procurement_types.id = unit_purchase_requests.procurement_type LEFT JOIN chargeability ON chargeability.id = unit_purchase_requests.chargeability WHERE status == "draft" AND (project_name LIKE ?1 OR chargeability.name LIKE ?1 OR upr_number LIKE ?1 OR place_of_delivery LIKE ?1 OR date_prepared LIKE ?1 OR procurement_types.code LIKE ?1 OR purpose LIKE ?1 OR other_infos LIKE ?1 OR payment_terms.name LIKE ?1 ) limit 20 offset ' + page, {1: query}, function (err, allRows) {
        if (err != null) {
          commit('UPR_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('UPR_SQLLIST', data)
      })
    })
  },
  listBidUprs ({ commit }, [page = 0, q = ""]) {
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select unit_purchase_requests.*, procurement_types.code as type, payment_terms.name as terms, chargeability.name as charge from unit_purchase_requests LEFT JOIN procurement_centers ON procurement_centers.id = unit_purchase_requests.procurement_office LEFT JOIN payment_terms ON payment_terms.id = unit_purchase_requests.terms_of_payment LEFT JOIN procurement_types ON procurement_types.id = unit_purchase_requests.procurement_type LEFT JOIN chargeability ON chargeability.id = unit_purchase_requests.chargeability WHERE  mode_of_procurement = "public_bidding" AND status != "draft" AND status != "Cancelled" AND (project_name LIKE ?1 OR chargeability.name LIKE ?1 OR upr_number LIKE ?1 OR place_of_delivery LIKE ?1 OR date_prepared LIKE ?1 OR procurement_types.code LIKE ?1 OR purpose LIKE ?1 OR other_infos LIKE ?1 OR payment_terms.name LIKE ?1 ) limit 20 offset ' + page, {1: query}, function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('UPR_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('UPR_SQLLIST', data)
      })
    })
  },
  getUpr ({ commit }, id) {
    db.serialize(function () {
      db.get('select (SELECT COUNT(id) FROM unit_purchase_requests where status != "draft") as total_upr, unit_purchase_requests.*, procurement_centers.short_code as centers, catered_units.short_code as unit_code from unit_purchase_requests LEFT JOIN catered_units ON catered_units.id = unit_purchase_requests.units LEFT JOIN procurement_centers ON procurement_centers.id = unit_purchase_requests.procurement_office where unit_purchase_requests.id=?', {1: id}, function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('UPR_SQLLIST', err)
        }
        commit('UPR_SQLLIST', allRows)
      })
    })
  },
  getUprEager ({ commit }, id) {
    db.serialize(function () {
      db.get('select unit_purchase_requests.*, procurement_types.code as type, mode_of_procurements.name as modes, payment_terms.name as terms, chargeability.name as charge, catered_units.short_code as unit_code , procurement_centers.short_code as centers from unit_purchase_requests LEFT JOIN procurement_centers ON procurement_centers.id = unit_purchase_requests.procurement_office LEFT JOIN catered_units ON catered_units.id = unit_purchase_requests.units LEFT JOIN mode_of_procurements ON mode_of_procurements.id = unit_purchase_requests.mode_of_procurement LEFT JOIN payment_terms ON payment_terms.id = unit_purchase_requests.terms_of_payment LEFT JOIN procurement_types ON procurement_types.id = unit_purchase_requests.procurement_type LEFT JOIN chargeability ON chargeability.id = unit_purchase_requests.chargeability where unit_purchase_requests.id=?', {1: id}, function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('UPR_SQLLIST', err)
        }
        commit('UPR_SQLLIST', allRows)
      })
    })
  },
  getUprTimeline ({ commit }, id) {
    db.serialize(function () {
      db.get('select unit_purchase_requests.*, philgeps_posting.philgeps_posting as pp_completed_at, philgeps_posting.days as pp_days, philgeps_posting.remarks as pp_remarks, philgeps_posting.action as pp_action, ispq_quotations.days as ispq_days, ispq_quotations.remarks as ispq_remarks, ispq_quotations.action as ispq_action, invitation_for_quotation.transaction_date as ispq_transaction_date, request_for_quotations.transaction_date as rfq_created_at, request_for_quotations.completed_at as rfq_completed_at, request_for_quotations.days as rfq_days, request_for_quotations.close_days as rfq_closed_days, request_for_quotations.close_remarks as rfq_close_remarks, request_for_quotations.close_action as rfq_close_action,request_for_quotations.remarks as rfq_remarks, request_for_quotations.action as rfq_action, canvassing.canvass_date as canvass_start_date, canvassing.id as canvass_id, canvassing.days as canvass_days, canvassing.remarks as canvass_remarks, canvassing.action as canvass_action, notice_of_awards.approved_days as noa_approved_days, notice_of_awards.received_days as noa_received_days, notice_of_awards.remarks as noa_remarks, notice_of_awards.action as noa_action, notice_of_awards.approved_remarks as noa_approved_remarks, notice_of_awards.approved_action as noa_approved_action, notice_of_awards.received_remarks as noa_received_remarks, notice_of_awards.received_action as noa_received_action, notice_of_awards.awarded_date as noa_award_date, notice_of_awards.accepted_date as noa_approved_date, notice_of_awards.award_accepted_date as noa_award_accepted_date, purchase_orders.id as po_id, purchase_orders.days as po_days, purchase_orders.remarks as po_remarks, purchase_orders.action as po_action, purchase_orders.purchase_date as po_create_date, purchase_orders.mfo_received_date, purchase_orders.funding_received_date, purchase_orders.funding_days as po_fund_days, purchase_orders.mfo_days as po_mfo_days, purchase_orders.coa_days as po_coa_days, purchase_orders.funding_remarks as po_funding_remarks, purchase_orders.funding_action as po_funding_action, purchase_orders.mfo_remarks as po_mfo_remarks, purchase_orders.mfo_action as po_mfo_action, purchase_orders.coa_remarks as po_coa_remarks, purchase_orders.coa_action as po_coa_action, purchase_orders.coa_approved_date, purchase_orders.delivery_terms, notice_to_proceed.id as ntp_id, notice_to_proceed.days as ntp_days, notice_to_proceed.accepted_days as ntp_accepted_days, notice_to_proceed.accepted_remarks as ntp_accepted_remarks, notice_to_proceed.accepted_action as ntp_accepted_action, notice_to_proceed.remarks as ntp_remarks, notice_to_proceed.action as ntp_action, notice_to_proceed.prepared_date as ntp_date, notice_to_proceed.award_accepted_date as ntp_award_date, (select delivery_orders.days from delivery_orders left join unit_purchase_requests as upr on delivery_orders.upr_id  = upr.id  where delivery_orders.upr_id = unit_purchase_requests.id order by delivery_orders.created_at desc limit 1) as dr_days, (select document_acceptance.approved_date from document_acceptance left join unit_purchase_requests as upr on document_acceptance.upr_id  = upr.id  where document_acceptance.upr_id = unit_purchase_requests.id order by document_acceptance.created_at desc limit 1) as doc_transaction_date, (select document_acceptance.days from document_acceptance left join unit_purchase_requests as upr on document_acceptance.upr_id  = upr.id  where document_acceptance.upr_id = unit_purchase_requests.id order by document_acceptance.created_at desc limit 1) as doc_days, (select document_acceptance.remarks from document_acceptance left join unit_purchase_requests as upr on document_acceptance.upr_id  = upr.id  where document_acceptance.upr_id = unit_purchase_requests.id order by document_acceptance.created_at desc limit 1) as doc_remarks, (select document_acceptance.action from document_acceptance left join unit_purchase_requests as upr on document_acceptance.upr_id  = upr.id  where document_acceptance.upr_id = unit_purchase_requests.id order by document_acceptance.created_at desc limit 1) as doc_action, (select pre_proc.pre_proc_date from pre_proc left join unit_purchase_requests as upr on pre_proc.upr_id  = upr.id  where pre_proc.upr_id = unit_purchase_requests.id order by pre_proc.created_at desc limit 1) as pre_proc_pre_proc_date, (select pre_proc.days from pre_proc left join unit_purchase_requests as upr on pre_proc.upr_id  = upr.id  where pre_proc.upr_id = unit_purchase_requests.id order by pre_proc.created_at desc limit 1) as pre_proc_days, (select pre_proc.remarks from pre_proc left join unit_purchase_requests as upr on pre_proc.upr_id  = upr.id  where pre_proc.upr_id = unit_purchase_requests.id order by pre_proc.created_at desc limit 1) as pre_proc_remarks, (select pre_proc.action from pre_proc left join unit_purchase_requests as upr on pre_proc.upr_id  = upr.id  where pre_proc.upr_id = unit_purchase_requests.id order by pre_proc.created_at desc limit 1) as pre_proc_action, (select invitation_to_bid.approved_date from invitation_to_bid left join unit_purchase_requests as upr on invitation_to_bid.upr_id  = upr.id  where invitation_to_bid.upr_id = unit_purchase_requests.id order by invitation_to_bid.created_at desc limit 1) as invitation_to_bid_approved_date, (select invitation_to_bid.days from invitation_to_bid left join unit_purchase_requests as upr on invitation_to_bid.upr_id  = upr.id  where invitation_to_bid.upr_id = unit_purchase_requests.id order by invitation_to_bid.created_at desc limit 1) as invitation_to_bid_days, (select invitation_to_bid.remarks from invitation_to_bid left join unit_purchase_requests as upr on invitation_to_bid.upr_id  = upr.id  where invitation_to_bid.upr_id = unit_purchase_requests.id order by invitation_to_bid.created_at desc limit 1) as invitation_to_bid_remarks, (select invitation_to_bid.action from invitation_to_bid left join unit_purchase_requests as upr on invitation_to_bid.upr_id  = upr.id  where invitation_to_bid.upr_id = unit_purchase_requests.id order by invitation_to_bid.created_at desc limit 1) as invitation_to_bid_action, (select pre_bid_conferences.transaction_date from pre_bid_conferences left join unit_purchase_requests as upr on pre_bid_conferences.upr_id  = upr.id  where pre_bid_conferences.upr_id = unit_purchase_requests.id order by pre_bid_conferences.created_at desc limit 1) as pre_bid_transaction_date, (select pre_bid_conferences.days from pre_bid_conferences left join unit_purchase_requests as upr on pre_bid_conferences.upr_id  = upr.id  where pre_bid_conferences.upr_id = unit_purchase_requests.id order by pre_bid_conferences.created_at desc limit 1) as pre_bid_days, (select pre_bid_conferences.remarks from pre_bid_conferences left join unit_purchase_requests as upr on pre_bid_conferences.upr_id  = upr.id  where pre_bid_conferences.upr_id = unit_purchase_requests.id order by pre_bid_conferences.created_at desc limit 1) as pre_bid_remarks, (select pre_bid_conferences.action from pre_bid_conferences left join unit_purchase_requests as upr on pre_bid_conferences.upr_id  = upr.id  where pre_bid_conferences.upr_id = unit_purchase_requests.id order by pre_bid_conferences.created_at desc limit 1) as pre_bid_action, (select post_qualification.transaction_date from post_qualification left join unit_purchase_requests as upr on post_qualification.upr_id  = upr.id  where post_qualification.upr_id = unit_purchase_requests.id order by post_qualification.created_at desc limit 1) as post_qualification_transaction_date,(select post_qualification.days from post_qualification left join unit_purchase_requests as upr on post_qualification.upr_id  = upr.id  where post_qualification.upr_id = unit_purchase_requests.id order by post_qualification.created_at desc limit 1) as post_qualification_days, (select post_qualification.remarks from post_qualification left join unit_purchase_requests as upr on post_qualification.upr_id  = upr.id  where post_qualification.upr_id = unit_purchase_requests.id order by post_qualification.created_at desc limit 1) as post_qualification_remarks, (select post_qualification.action from post_qualification left join unit_purchase_requests as upr on post_qualification.upr_id  = upr.id  where post_qualification.upr_id = unit_purchase_requests.id order by post_qualification.created_at desc limit 1) as post_qualification_action,  (select bid_opening.closing_date from bid_opening left join unit_purchase_requests as upr on bid_opening.upr_id  = upr.id  where bid_opening.upr_id = unit_purchase_requests.id order by bid_opening.created_at desc limit 1) as bid_opening_closing_date,  (select bid_opening.transaction_date from bid_opening left join unit_purchase_requests as upr on bid_opening.upr_id  = upr.id  where bid_opening.upr_id = unit_purchase_requests.id order by bid_opening.created_at desc limit 1) as bid_opening_transaction_date, (select bid_opening.days from bid_opening left join unit_purchase_requests as upr on bid_opening.upr_id  = upr.id  where bid_opening.upr_id = unit_purchase_requests.id order by bid_opening.created_at desc limit 1) as bid_opening_days, (select bid_opening.remarks from bid_opening left join unit_purchase_requests as upr on bid_opening.upr_id  = upr.id  where bid_opening.upr_id = unit_purchase_requests.id order by bid_opening.created_at desc limit 1) as bid_opening_remarks, (select bid_opening.action from bid_opening left join unit_purchase_requests as upr on bid_opening.upr_id  = upr.id  where bid_opening.upr_id = unit_purchase_requests.id order by bid_opening.created_at desc limit 1) as bid_opening_action, (select delivery_orders.date_delivered_to_coa from delivery_orders left join unit_purchase_requests as upr on delivery_orders.upr_id  = upr.id  where delivery_orders.upr_id = unit_purchase_requests.id order by delivery_orders.created_at desc limit 1) as dr_coa_date,  (select delivery_orders.remarks from delivery_orders left join unit_purchase_requests as upr on delivery_orders.upr_id  = upr.id  where delivery_orders.upr_id = unit_purchase_requests.id order by delivery_orders.created_at desc limit 1) as dr_remarks, (select delivery_orders.action from delivery_orders left join unit_purchase_requests as upr on delivery_orders.upr_id  = upr.id  where delivery_orders.upr_id = unit_purchase_requests.id order by delivery_orders.created_at desc limit 1) as dr_action, (select delivery_orders.delivery_days from delivery_orders left join unit_purchase_requests as upr on delivery_orders.upr_id  = upr.id  where delivery_orders.upr_id = unit_purchase_requests.id order by delivery_orders.created_at desc limit 1) as dr_delivery_days, (select delivery_orders.delivery_remarks from delivery_orders left join unit_purchase_requests as upr on delivery_orders.upr_id  = upr.id  where delivery_orders.upr_id = unit_purchase_requests.id order by delivery_orders.created_at desc limit 1) as dr_delivery_remarks, (select delivery_orders.delivery_action from delivery_orders left join unit_purchase_requests as upr on delivery_orders.upr_id  = upr.id  where delivery_orders.upr_id = unit_purchase_requests.id order by delivery_orders.created_at desc limit 1) as dr_delivery_action, (select delivery_orders.dr_coa_days from delivery_orders left join unit_purchase_requests as upr on delivery_orders.upr_id  = upr.id  where delivery_orders.upr_id = unit_purchase_requests.id order by delivery_orders.created_at desc limit 1) as dr_dr_coa_days, (select delivery_orders.dr_coa_remarks from delivery_orders left join unit_purchase_requests as upr on delivery_orders.upr_id  = upr.id  where delivery_orders.upr_id = unit_purchase_requests.id order by delivery_orders.created_at desc limit 1) as dr_dr_coa_remarks, (select delivery_orders.dr_coa_action from delivery_orders left join unit_purchase_requests as upr on delivery_orders.upr_id  = upr.id  where delivery_orders.upr_id = unit_purchase_requests.id order by delivery_orders.created_at desc limit 1) as dr_dr_coa_action, (select delivery_orders.delivery_date from delivery_orders left join unit_purchase_requests as upr on delivery_orders.upr_id  = upr.id  where delivery_orders.upr_id = unit_purchase_requests.id order by delivery_orders.created_at desc limit 1) as delivery_date, inspection_acceptance_report.id as tiac_id, inspection_acceptance_report.accept_days as tiac_accept_days, inspection_acceptance_report.accept_remarks as tiac_accept_remarks, inspection_acceptance_report.accept_action as tiac_accept_action, inspection_acceptance_report.days as tiac_days, inspection_acceptance_report.remarks as tiac_remarks, inspection_acceptance_report.action as tiac_action, inspection_acceptance_report.inspection_date as dr_inspection, inspection_acceptance_report.accepted_date as iar_accepted_date, delivery_inspection.id as diir_id, delivery_inspection.days as diir_days, delivery_inspection.close_days as diir_close_days, delivery_inspection.remarks as diir_remarks, delivery_inspection.action as diir_action, delivery_inspection.close_remarks as diir_close_remarks, delivery_inspection.close_action as diir_close_action, delivery_inspection.closed_date as di_close, delivery_inspection.start_date as di_start, vouchers.id as vou_id, vouchers.days as vou_days, vouchers.preaudit_days as vou_preaudit_days, vouchers.preaudit_remarks as vou_preaudit_remarks, vouchers.preaudit_action as vou_preaudit_action, vouchers.certify_days as vou_certify_days, vouchers.certify_remarks as vou_certify_remarks, vouchers.certify_action as vou_certify_action, vouchers.jev_days as vou_jev_days, vouchers.jev_remarks as vou_jev_remarks, vouchers.jev_action as vou_jev_action, vouchers.approved_days as vou_approved_days, vouchers.approved_remarks as vou_approved_remarks, vouchers.approved_action as vou_approved_action, vouchers.released_days as vou_released_days, vouchers.released_remarks as vou_released_remarks, vouchers.released_action as vou_released_action, vouchers.received_days as vou_received_days, vouchers.received_remarks as vou_received_remarks, vouchers.received_action as vou_received_action, vouchers.remarks as vou_remarks, vouchers.action as vou_action, vouchers.created_at as vou_start, vouchers.transaction_date as v_transaction_date, vouchers.preaudit_date as vou_preaudit_date, vouchers.certify_date as certify_date, vouchers.journal_entry_date as journal_entry_date, vouchers.approval_date as vou_approval_date, vouchers.payment_release_date as vou_release, vouchers.payment_received_date as vou_received FROM unit_purchase_requests LEFT JOIN ispq_quotations ON ispq_quotations.upr_id = unit_purchase_requests.id LEFT JOIN philgeps_posting ON philgeps_posting.upr_id = unit_purchase_requests.id LEFT JOIN delivery_inspection ON delivery_inspection.upr_id = unit_purchase_requests.id LEFT JOIN vouchers ON vouchers.upr_id = unit_purchase_requests.id LEFT JOIN inspection_acceptance_report ON inspection_acceptance_report.upr_id = unit_purchase_requests.id LEFT JOIN notice_of_awards ON notice_of_awards.upr_id = unit_purchase_requests.id LEFT JOIN notice_to_proceed ON notice_to_proceed.upr_id = unit_purchase_requests.id LEFT JOIN purchase_orders ON purchase_orders.upr_id = unit_purchase_requests.id LEFT JOIN request_for_quotations ON request_for_quotations.upr_id = unit_purchase_requests.id LEFT JOIN canvassing ON canvassing.upr_id = unit_purchase_requests.id LEFT JOIN invitation_for_quotation ON invitation_for_quotation.id = ispq_quotations.ispq_id where unit_purchase_requests.id=?', {1: id}, function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('UPR_SQLLIST', err)
        }
        commit('UPR_SQLLIST', allRows)
      })
    })
  },
  dropdownUprs ({ commit }, page = 1) {
    db.serialize(function () {
      db.all('select * from unit_purchase_requests', function (err, allRows) {
        if (err != null) {
          commit('UPR_SQLLIST', err)
        }
        commit('UPR_LIST2', allRows)
      })
    })
  },
  createUpr ({ commit }, upr) {
    commit('UPR_SQLCreate', UprSQLite.save(upr))
  },
  deleteUpr ({ commit }, upr) {
    commit('UPR_SQLCreate', UprSQLite.delete(upr))
  },
  updateUpr ({ commit }, [id, model]) {
    // commit('UPR_SQLCreate', UprSQLite.update(id, model))

    var fields = []
    var values = []
    for (var key in model) {
      fields.push(key+' = ?')
      values.push(model[key])
    }
    values.push(id)
    var newVal = '"' + values.join('","') + '"'

    db.serialize(function () {
      db.parallelize(function () {
        db.run("UPDATE unit_purchase_requests SET " + fields.join(',') + " WHERE id = ?", values, function(err, row) {
          console.log(err)
          if (err == null) {
            db.get('select unit_purchase_requests.* from unit_purchase_requests where unit_purchase_requests.id =?', {1: id}, function (err, allRows) {
              if (err != null) {
                console.log(err)
              }
              console.log(allRows)
              commit('UPR_SQLUpdate', allRows)
            })
          }
        })
      })
    })
  },
  syncUprs ({ commit }, uprs) {
    UPRResource.all().then(response => {
      commit('UPR_SQLSync', UprSQLite.syncNew(response.data.data))
    })
  },
  getDistinctPlace({ commit }) {
    db.serialize(function () {
      db.all('select DISTINCT place_of_delivery from unit_purchase_requests', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('UPR_PLACE_List', err)
        }
        commit('UPR_PLACE_List', allRows)
      })
    })
  },
  getDistinctFund({ commit }) {
    db.serialize(function () {
      db.all('select DISTINCT fund_validity from unit_purchase_requests', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('UPR_FUND_List', err)
        }
        commit('UPR_FUND_List', allRows)
      })
    })
  },
  getDistinctInfo({ commit }) {
    db.serialize(function () {
      db.all('select DISTINCT other_infos from unit_purchase_requests', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('UPR_INFO_List', err)
        }
        commit('UPR_INFO_List', allRows)
      })
    })
  },
  getDistinctPurpose({ commit }) {
    db.serialize(function () {
      db.all('select DISTINCT purpose from unit_purchase_requests', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('UPR_PURPOSE_List', err)
        }
        commit('UPR_PURPOSE_List', allRows)
      })
    })
  },
  serverUprPush ({ commit }) {
    // commit('UPR_SQLPush', UprSQLite.serverPush(UprSQLite.getNew()))
    db.serialize(function () {
      db.all('select * from unit_purchase_requests where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('UPR_SQLPush', err)
        }
        UPRResource.serverPush(allRows)
        commit('UPR_SQLPush', allRows)
      })
    })
  },
  getUprs ({ commit }, page = 1) {
    UPRResource.all(page).then(response => {
      commit('UPR_LIST', response.data.data)
    })
  }
}

// getters are functions
const getters = {
  uprs: state => state.uprs,
  places: state => state.places,
  infos: state => state.infos,
  uprCenters: state => state.uprCenters,
  overviewUPR: state => state.overviewUPR,
  uprUnits: state => state.uprUnits,
  funds: state => state.funds,
  purpose: state => state.purpose
}

export default {
  state,
  getters,
  mutations,
  actions
}
