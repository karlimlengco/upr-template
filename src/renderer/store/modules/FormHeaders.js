import FormHeadersResource from '../../api/form-headers'
import FormHeadersSQLite from '../../sqlite/form-headers'

import { db } from '../../../server/db.js'


const state = {
  formHeaders: []
}

const mutations = {
  FORM_HEADER_SQLLIST (state, formHeaders) {
    state.formHeaders = formHeaders
  },
  FORM_HEADER_LIST (state, formHeaders) {
    state.formHeaders = formHeaders
  },
  FORM_HEADER_LIST2 (state, formHeaders) {
    state.formHeaders = formHeaders
  },
  FORM_HEADER_SQLCreate (state, formHeader) {
    // state.formHeaders.push(formHeader)
  },
  FORM_HEADER_SQLCreateNew (state, formHeader) {
    state.formHeaders.push(formHeader)
  },
  FORM_HEADER_SQLSync (state, formHeader) {
    // state.formHeaders.push(formHeader)
  },
  FORM_HEADER_SQLPush (state, formHeader) {
    // state.formHeaders.push(formHeader)
  }
}

const actions = {
  listFormHeaders ({ commit }, [page = 0, q = ""]) {
    // commit('FORM_HEADER_SQLLIST', FormHeaderssQLite.getAll(page))
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select * from form_headers WHERE description LIKE ?1 OR name LIKE ?1 LIMIT 20 OFFSET ' + page, {1: query}, function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('FORM_HEADER_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('FORM_HEADER_SQLLIST', data)
      })
    })
  },
  dropdownFormHeaders ({ commit }, page = 1) {
    db.serialize(function () {
      db.all('select id, name, description from form_headers', function (err, allRows) {
        if (err != null) {
          commit('FORM_HEADER_SQLLIST', err)
        }
        commit('FORM_HEADER_LIST2', allRows)
      })
    })
  },
  createFormHeader ({ commit }, formHeader) {
    var fields = []
    var values = []
    var placeholder = ""
    var count = 0
    for (var key in formHeader) {
      if (count == 0) {
        placeholder += "?"
      } else {
        placeholder += ",?"
      }
      count ++

      fields.push(key)
      values.push(FormHeader[key])
    }
    db.serialize(function () {
      db.run("INSERT INTO form_headers (" + fields.join() + ") VALUES (" + placeholder + ")", values, function (err, row) {
        if (err) {
          console.log(err)
        }
        db.get('select * from form_headers order by created_at desc limit 1', function (err, allRows) {
          if (err != null) {
            commit('FORM_HEADER_SQLLIST', err)
          }
          commit('FORM_HEADER_SQLCreateNew', allRows)
        })
        // commit('FORM_HEADER_SQLCreateNew', row)
      })
    })
  },
  syncFormHeaders ({ commit }, formHeaders) {
    FormHeadersResource.all().then(response => {
      commit('FORM_HEADER_SQLSync', FormHeadersSQLite.syncNew(response.data.data))
    })
  },
  serverFormHeaderPush ({ commit }) {
    // commit('FORM_HEADER_SQLPush', FormHeaderssQLite.serverPush(FormHeadersSQLite.getNew()))
    db.serialize(function () {
      db.all('select * from form_headers where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('FORM_HEADER_SQLPush', err)
        }
        FormHeadersResource.serverPush(allRows)
        commit('FORM_HEADER_SQLPush', allRows)
      })
    })
  },
  getFormHeaders ({ commit }, page = 1) {
    FormHeadersResource.all(page).then(response => {
      commit('FORM_HEADER_LIST', response.data.data)
    })
  }
}

// getters are functions
const getters = {
  formHeaders: state => state.formHeaders
}

export default {
  state,
  getters,
  mutations,
  actions
}
