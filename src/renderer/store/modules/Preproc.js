import PreprocResource from '../../api/preproc'
import PreprocSQLite from '../../sqlite/preproc'
import { db } from '../../../server/db.js'

const state = {
  preprocs: []
}

const mutations = {
  PREPROC_SQLLIST (state, pre_proc) {
    state.preprocs = pre_proc
  },
  PREPROC_LIST (state, pre_proc) {
    state.preprocs = pre_proc
  },
  PREPROC_SQLCreate (state, pre_proc) {
    // state.pre_proc.push(pre_proc)
  },
  PREPROC_SQLSync (state, pre_proc) {
    // state.puchase_orders.push(pre_proc)
  },
  PREPROC_SQLPush (state, pre_proc) {
    // state.POs.push(pre_proc)
  }
}

const actions = {
  listPreproc ({ commit }, [page = 0, q = ""]) {
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select * from pre_proc WHERE upr_number LIKE ?1 OR resched_remarks LIKE ?1 OR resched_date LIKE ?1 OR pre_proc_date LIKE ?1 OR ref_number LIKE ?1 LIMIT 20 OFFSET '+ page, {1: query}, function (err, allRows) {
        if (err != null) {
          commit('PREPROC_SQLLIST', err)
          console.log(query)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('PREPROC_SQLLIST', data)
      })
    })
  },
  createPreproc ({ commit }, pre_proc) {
    commit('PREPROC_SQLCreate', PreprocSQLite.save(pre_proc))
  },
  updatePreproc ({ commit }, [id, pre_proc]) {
    commit('PREPROC_SQLCreate', PreprocSQLite.update(id, pre_proc))
  },
  syncPreproc ({ commit }, pre_proc) {
    PreprocResource.all().then(response => {
      commit('PREPROC_SQLSync', PreprocSQLite.syncNew(response.data.data))
    })
  },
  serverPreprocPush ({ commit }) {
    // commit('PREPROC_SQLPush', PreprocSQLite.serverPush(PreprocSQLite.getNew()))
    db.serialize(function () {
      db.all('select * from pre_proc where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('PREPROC_SQLPush', err)
        }
        PreprocResource.serverPush(allRows)
        commit('PREPROC_SQLPush', allRows)
        // PreprocSQLite.markAsSync(allRows)
      })
    })
  },
  getPreproc ({ commit }, id) {
    db.serialize(function () {
      db.get('select pre_proc.* from pre_proc where pre_proc.id =?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('PREPROC_LIST', err)
        }
        commit('PREPROC_LIST', allRows)
      })
    })
  },
  getPreprocByUPR ({ commit }, id) {
    db.serialize(function () {
      db.get('select pre_proc.* from pre_proc LEFT JOIN purchase_orders ON purchase_orders.upr_id = unit_purchase_requests.id LEFT JOIN unit_purchase_requests on pre_proc.upr_id = unit_purchase_requests.id where pre_proc.upr_id =? ', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('PREPROC_LIST', err)
        }
        commit('PREPROC_LIST', allRows)
      })
    })
  }
}

// getters are functions
const getters = {
  preprocs: state => state.preprocs
}

export default {
  state,
  getters,
  mutations,
  actions
}
