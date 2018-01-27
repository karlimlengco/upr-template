import ITBResource from '../../api/itb'
import ITBSQLite from '../../sqlite/itb'
import { db } from '../../../server/db.js'

const state = {
  itb: []
}

const mutations = {
  ITB_SQLLIST (state, itb) {
    state.itb = itb
  },
  ITB_LIST (state, itb) {
    state.itb = itb
  },
  ITB_SQLCreate (state, itb) {
    // state.itb.push(itb)
  },
  ITB_SQLSync (state, itb) {
    // state.puchase_orders.push(itb)
  },
  ITB_SQLPush (state, itb) {
    // state.POs.push(itb)
  }
}

const actions = {
  listITB ({ commit }, [page = 0, q = ""]) {
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select * from invitation_to_bid WHERE upr_number LIKE ?1 OR approved_date LIKE ?1 OR ref_number LIKE ?1 LIMIT 20 OFFSET '+ page, {1: query},  function (err, allRows) {
        if (err != null) {
          commit('ITB_SQLLIST', err)
          console.log(err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('ITB_SQLLIST', data)
      })
    })
  },
  createITB ({ commit }, itb) {
    commit('ITB_SQLCreate', ITBSQLite.save(itb))
  },
  updateITB ({ commit }, [id, itb]) {
    commit('ITB_SQLCreate', ITBSQLite.update(id, itb))
  },
  syncITB ({ commit }, itb) {
    ITBResource.all().then(response => {
      commit('ITB_SQLSync', ITBSQLite.syncNew(response.data.data))
    })
  },
  serverITBPush ({ commit }) {
    // commit('ITB_SQLPush', ITBSQLite.serverPush(ITBSQLite.getNew()))
    db.serialize(function () {
      db.all('select * from invitation_to_bid where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('ITB_SQLPush', err)
        }
        ITBResource.serverPush(allRows)
        commit('ITB_SQLPush', allRows)
        // ITBSQLite.markAsSync(allRows)
      })
    })
  },
  getITB ({ commit }, id) {
    db.serialize(function () {
      db.get('select invitation_to_bid.* from invitation_to_bid where invitation_to_bid.id =?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('ITB_LIST', err)
        }
        commit('ITB_LIST', allRows)
      })
    })
  },
  getITBByUPR ({ commit }, id) {
    db.serialize(function () {
      db.get('select invitation_to_bid.* from invitation_to_bid LEFT JOIN purchase_orders ON purchase_orders.upr_id = unit_purchase_requests.id LEFT JOIN unit_purchase_requests on invitation_to_bid.upr_id = unit_purchase_requests.id where invitation_to_bid.upr_id =? ', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('ITB_LIST', err)
        }
        commit('ITB_LIST', allRows)
      })
    })
  }
}

// getters are functions
const getters = {
  itb: state => state.itb
}

export default {
  state,
  getters,
  mutations,
  actions
}
