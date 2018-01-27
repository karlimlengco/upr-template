import NODItemsResource from '../../api/nod-items'
import NODSQLite from '../../sqlite/nod-items'
import { db } from '../../../server/db.js'

const state = {
  nodItems: []
}

const mutations = {
  NODITEMS_SQLLIST (state, nodItems) {
    state.nodItems = nodItems
  },
  NODITEMS_LIST (state, nodItems) {
    state.nodItems = nodItems
  },
  NODITEMS_SQLCreate (state, nodItems) {
    // state.nod.push(nodItems)
  },
  NODITEMS_SQLSync (state, nodItems) {
    // state.nod.push(nodItems)
  },
  NODITEMS_SQLPush (state, nodItems) {
    // state.nod.push(nodItems)
  }
}

const actions = {
  listNODItems ({ commit }, page = 1) {
    var data = {}
    db.serialize(function () {
      db.all('select * from delivery_order_items', function (err, allRows) {
        if (err != null) {
          commit('NODITEMS_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('NODITEMS_SQLLIST', data)
      })
    })
  },
  createNODItems ({ commit }, nodItems) {
    commit('NODITEMS_SQLCreate', NODSQLite.save(nodItems))
  },
  syncNODItems ({ commit }, nodItems) {
    NODItemsResource.all().then(response => {
      commit('NODITEMS_SQLSync', NODSQLite.syncNew(response.data.data))
    })
  },
  serverNODItemsPush ({ commit }) {
    // commit('NODITEMS_SQLPush', NODSQLite.serverPush(NODSQLite.getNew()))
    db.serialize(function () {
      db.all('select * from delivery_order_items where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('NODITEMS_SQLPush', err)
        }
        NODItemsResource.serverPush(allRows)
        commit('NODITEMS_SQLPush', allRows)
        // NODSQLite.markAsSync(allRows)
      })
    })
  },
  getNODItems ({ commit }, id) {
    db.serialize(function () {
      db.get('select delivery_order_items.* from delivery_order_items where delivery_order_items.id =?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('NODITEMS_LIST', err)
        }
        commit('NODITEMS_LIST', allRows)
      })
    })
  },
  updateNODItems ({ commit }, [id, model]) {
    commit('NODITEMS_SQLCreate', NODSQLite.update(id, model))
  },
  getNODItemsByOrder ({ commit }, id) {
    db.serialize(function () {
      db.all('select delivery_order_items.* from delivery_order_items where delivery_order_items.order_id =?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('NODITEMS_LIST', err)
        }
        commit('NODITEMS_LIST', allRows)
      })
    })
  }
}

// getters are functions
const getters = {
  nodItems: state => state.nodItems
}

export default {
  state,
  getters,
  mutations,
  actions
}
