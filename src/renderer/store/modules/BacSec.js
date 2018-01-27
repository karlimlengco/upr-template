import BacSecResource from '../../api/bacsec'
import BacSecSQLite from '../../sqlite/bacsec'
import { db } from '../../../server/db.js'



const state = {
  bacsecs: []
}

const mutations = {
  BACSEC_SQLLIST (state, bacsecs) {
    state.bacsecs = bacsecs
  },
  BACSEC_LIST (state, bacsecs) {
    state.bacsecs = bacsecs
  },
  BACSEC_LIST2 (state, bacsecs) {
    state.bacsecs = bacsecs
  },
  BACSEC_SQLCreate (state, bacsec) {
    // state.bacsecs.push(bacsec)
  },
  BACSEC_SQLSync (state, bacsec) {
    // state.bacsecs.push(bacsec)
  },
  BACSEC_SQLPush (state, bacsec) {
    // state.bacsecs.push(bacsec)
  }
}

const actions = {
  listBacSec ({ commit }, [page = 0, q = ""]) {
    // commit('BACSEC_SQLLIST', BacSecSQLite.getAll(page))
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select * from bacsec WHERE name LIKE ?1 OR description LIKE ?1 LIMIT 20 OFFSET '+ page, {1: query},function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('BACSEC_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('BACSEC_SQLLIST', data)
      })
    })
  },
  createBacSec ({ commit }, bacsec) {
    commit('BACSEC_SQLCreate', BacSecSQLite.save(bacsec))
  },
  syncBacSec ({ commit }, bacsecs) {
    BacSecResource.all().then(response => {
      commit('BACSEC_SQLSync', BacSecSQLite.syncNew(response.data.data))
    })
  },
  dropdownBacsec ({ commit }, page = 1) {
    db.serialize(function () {
      db.all('select * from bacsec', function (err, allRows) {
        if (err != null) {
          commit('BACSEC_SQLLIST', err)
        }
        commit('BACSEC_SQLLIST', allRows)
      })
    })
  },
  serverBacSecPush ({ commit }) {
    // commit('BACSEC_SQLPush', BacSecSQLite.serverPush(BacSecSQLite.getNew()))
    db.serialize(function () {
      db.all('select * from bacsec where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('BACSEC_SQLPush', err)
        }
        BacSecResource.serverPush(allRows)
        commit('BACSEC_SQLPush', allRows)
      })
    })
  },
  getBacSec ({ commit }, page = 1) {
    BacSecResource.all(page).then(response => {
      commit('BACSEC_LIST', response.data.data)
    })
  }
}

// getters are functions
const getters = {
  bacsecs: state => state.bacsecs
}

export default {
  state,
  getters,
  mutations,
  actions
}
