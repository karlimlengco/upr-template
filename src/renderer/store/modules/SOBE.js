import SOBEResource from '../../api/sobe'
import SOBESQLite from '../../sqlite/sobe'
import { db } from '../../../server/db.js'

const state = {
  sobe: []
}

const mutations = {
  SOBE_SQLLIST (state, sobe) {
    state.sobe = sobe
  },
  SOBE_LIST (state, sobe) {
    state.sobe = sobe
  },
  SOBE_SQLCreate (state, sobe) {
    // state.sobe.push(sobe)
  },
  SOBE_SQLSync (state, sobe) {
    // state.puchase_orders.push(sobe)
  },
  SOBE_SQLPush (state, sobe) {
    // state.POs.push(sobe)
  }
}

const actions = {
  listSOBE ({ commit }, [page = 0, q = ""]) {
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select * from bid_opening WHERE upr_number LIKE ?1 OR transaction_date LIKE ?1 OR ref_number LIKE ?1 LIMIT 20 OFFSET '+ page, {1: query}, function (err, allRows) {
        if (err != null) {
          commit('SOBE_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('SOBE_SQLLIST', data)
      })
    })
  },
  createSOBE ({ commit }, sobe) {
    commit('SOBE_SQLCreate', SOBESQLite.save(sobe))
  },
  updateSOBE ({ commit }, [id, model]) {
    commit('SOBE_SQLCreate', SOBESQLite.update(id, model))
  },
  syncSOBE ({ commit }, sobe) {
    SOBEResource.all().then(response => {
      commit('SOBE_SQLSync', SOBESQLite.syncNew(response.data.data))
    })
  },
  serverSOBEPush ({ commit }) {
    // commit('SOBE_SQLPush', SOBESQLite.serverPush(SOBESQLite.getNew()))
    db.serialize(function () {
      db.all('select * from bid_opening where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('SOBE_SQLPush', err)
        }
        SOBEResource.serverPush(allRows)
        commit('SOBE_SQLPush', allRows)
        // SOBESQLite.markAsSync(allRows)
      })
    })
  },
  getSOBE ({ commit }, id) {
    db.serialize(function () {
      db.get('select bid_opening.* from bid_opening where bid_opening.id =?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('SOBE_LIST', err)
        }
        commit('SOBE_LIST', allRows)
      })
    })
  },
  getSOBEByUpr ({ commit }, id) {
    db.serialize(function () {
      db.get('select bid_opening.* from bid_opening where bid_opening.upr_id =?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('SOBE_LIST', err)
        }
        commit('SOBE_LIST', allRows)
      })
    })
  }
}

// getters are functions
const getters = {
  sobe: state => state.sobe
}

export default {
  state,
  getters,
  mutations,
  actions
}
