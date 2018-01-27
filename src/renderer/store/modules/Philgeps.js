import PhilgepsResource from '../../api/philgeps'
import PhilgepsSQLite from '../../sqlite/philgeps'
import { db } from '../../../server/db.js'

const state = {
  philgeps: []
}

const mutations = {
  PHILGEPS_SQLLIST (state, philgeps) {
    state.philgeps = philgeps
  },
  PHILGEPS_LIST (state, philgeps) {
    state.philgeps = philgeps
  },
  PHILGEPS_SQLCreate (state, philgep) {
    // state.philgeps.push(philgep)
  },
  PHILGEPS_SQLSync (state, philgep) {
    // state.philgeps.push(philgep)
  },
  PHILGEPS_SQLPush (state, philgep) {
    // state.philgeps.push(philgep)
  }
}

const actions = {
  listPhilgeps ({ commit }, [page = 0, q = ""]) {
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
    db.all('select philgeps_posting.*, unit_purchase_requests.mode_of_procurement from philgeps_posting LEFT JOIN unit_purchase_requests ON philgeps_posting.upr_id = unit_purchase_requests.id WHERE unit_purchase_requests.mode_of_procurement != "public_bidding" AND (philgeps_posting.upr_number LIKE ?1 OR philgeps_number LIKE ?1 OR philgeps_posting LIKE ?1 OR newspaper LIKE ?1)  LIMIT 20 OFFSET '+ page, {1: query},  function (err, allRows) {
        if (err != null) {
          commit('PHILGEPS_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('PHILGEPS_SQLLIST', data)
      })
    })
  },
  listBidPhilgeps ({ commit }, [page = 0, q = ""]) {
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select philgeps_posting.*, unit_purchase_requests.mode_of_procurement from philgeps_posting LEFT JOIN unit_purchase_requests ON philgeps_posting.upr_id = unit_purchase_requests.id WHERE unit_purchase_requests.mode_of_procurement = "public_bidding" AND (philgeps_posting.upr_number LIKE ?1 OR philgeps_number LIKE ?1 OR philgeps_posting LIKE ?1 OR newspaper LIKE ?1) LIMIT 20 OFFSET '+ page, {1: query},  function (err, allRows) {
        if (err != null) {
          commit('PHILGEPS_SQLLIST', err)
          console.log(err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('PHILGEPS_SQLLIST', data)
      })
    })
  },
  createPhilgeps ({ commit }, philgep) {
    commit('PHILGEPS_SQLCreate', PhilgepsSQLite.save(philgep))
  },
  updatePhilgeps ({ commit }, [id, philgep]) {
    commit('PHILGEPS_SQLCreate', PhilgepsSQLite.update(id, philgep))
  },
  syncPhilgeps ({ commit }, philgeps) {
    PhilgepsResource.all().then(response => {
      commit('PHILGEPS_SQLSync', PhilgepsSQLite.syncNew(response.data.data))
    })
  },
  serverPhilgepsPush ({ commit }) {
    // commit('PHILGEPS_SQLPush', PhilgepsSQLite.serverPush(PhilgepsSQLite.getNew()))
    db.serialize(function () {
      db.all('select * from philgeps_posting where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('PHILGEPS_SQLPush', err)
        }
        PhilgepsResource.serverPush(allRows)
        commit('PHILGEPS_SQLPush', allRows)
        // PhilgepsSQLite.markAsSync(allRows)
      })
    })
  },
  getPhilgeps ({ commit }, id) {
    db.serialize(function () {
      db.get('select * from philgeps_posting where id=?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('PHILGEPS_LIST', err)
        }
        commit('PHILGEPS_LIST', allRows)
      })
    })
  },
  getPhilgepsByUpr ({ commit }, id) {
    db.serialize(function () {
      db.get('select * from philgeps_posting where upr_id=?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('PHILGEPS_LIST', err)
        }
        commit('PHILGEPS_LIST', allRows)
      })
    })
  }
}

// getters are functions
const getters = {
  philgeps: state => state.philgeps
}

export default {
  state,
  getters,
  mutations,
  actions
}
