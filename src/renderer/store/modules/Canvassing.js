import CanvassingResource from '../../api/canvassing'
import CanvassingSQLite from '../../sqlite/canvassing'
import { db } from '../../../server/db.js'

const state = {
  canvassings: []
}

const mutations = {
  CANVASSING_SQLLIST (state, canvassing) {
    state.canvassings = canvassing
  },
  CANVASSING_LIST (state, canvassing) {
    state.canvassings = canvassing
  },
  CANVASSING_SQLCreate (state, canvassing) {
    // state.rfq.push(canvassing)
  },
  CANVASSING_SQLSync (state, canvassing) {
    // state.rfq.push(canvassing)
  },
  CANVASSING_SQLPush (state, canvassing) {
    // state.rfq.push(canvassing)
  }
}

const actions = {
  listCanvassing ({ commit }, page = 1) {
    var data = {}
    db.serialize(function () {
      db.all('select * from canvassing', function (err, allRows) {
        if (err != null) {
          commit('CANVASSING_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('CANVASSING_SQLLIST', data)
      })
    })
  },
  createCanvassing ({ commit }, canvassing) {
    commit('CANVASSING_SQLCreate', CanvassingSQLite.save(canvassing))
  },
  syncCanvassing ({ commit }, canvassing) {
    CanvassingResource.all().then(response => {
      commit('CANVASSING_SQLSync', CanvassingSQLite.syncNew(response.data.data))
    })
  },
  serverCanvassingPush ({ commit }) {
    // commit('CANVASSING_SQLPush', CanvassingSQLite.serverPush(CanvassingSQLite.getNew()))
    db.serialize(function () {
      db.all('select * from canvassing where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('CANVASSING_SQLPush', err)
        }
        CanvassingResource.serverPush(allRows)
        commit('CANVASSING_SQLPush', allRows)
        // CanvassingSQLite.markAsSync(allRows)
      })
    })
  },
  updateCanvassing ({ commit }, [id, model]) {
    commit('CANVASSING_SQLCreate', CanvassingSQLite.update(id, model))
  },
  getCanvassing ({ commit }, id) {
    db.serialize(function () {
      db.get('select canvassing.*, unit_purchase_requests.total_amount from canvassing JOIN unit_purchase_requests ON canvassing.upr_id = unit_purchase_requests.id where canvassing.id=?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('CANVASSING_LIST', err)
        }
        commit('CANVASSING_LIST', allRows)
      })
    })
  },
  getCanvassingOnly ({ commit }, id) {
    db.serialize(function () {
      db.get('select canvassing.* from canvassing  where canvassing.id=?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('CANVASSING_LIST', err)
        }
        commit('CANVASSING_LIST', allRows)
      })
    })
  },
  getCanvassByUPR ({ commit }, id) {
    db.serialize(function () {
      db.get('select * from canvassing  where upr_id =?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('CANVASSING_LIST', err)
        }
        commit('CANVASSING_LIST', allRows)
      })
    })
  }
}

// getters are functions
const getters = {
  canvassings: state => state.canvassings
}

export default {
  state,
  getters,
  mutations,
  actions
}
