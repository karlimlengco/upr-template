import PaymentTermResource from '../../api/terms'
import PaymentTermSQLite from '../../sqlite/terms'
import { db } from '../../../server/db.js'



const state = {
  paymentTerms: []
}

const mutations = {
  PAYMENT_TERM_SQLLIST (state, paymentTerms) {
    state.paymentTerms = paymentTerms
  },
  PAYMENT_TERM_LIST (state, paymentTerms) {
    state.paymentTerms = paymentTerms
  },
  PAYMENT_TERM_LIST2 (state, paymentTerms) {
    state.paymentTerms = paymentTerms
  },
  PAYMENT_TERM_SQLCreate (state, paymentTerm) {
    // state.paymentTerms.push(paymentTerm)
  },
  PAYMENT_TERM_SQLSync (state, paymentTerm) {
    // state.paymentTerms.push(paymentTerm)
  },
  PAYMENT_TERM_SQLPush (state, paymentTerm) {
    // state.paymentTerms.push(paymentTerm)
  }
}

const actions = {
  listPaymentTerms ({ commit },  [page = 0, q = ""]) {
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select * from payment_terms WHERE name LIKE ?1 OR description LIKE ?1 LIMIT 20 OFFSET ' + page, {1: query}, function (err, allRows) {
        if (err != null) {
          commit('PAYMENT_TERM_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('PAYMENT_TERM_SQLLIST', data)
      })
    })
  },
  dropdownPaymentTerms ({ commit }, page = 1) {
    // commit('PAYMENT_TERM_SQLLIST', PaymentTermSQLite.getAll(page))
    db.serialize(function () {
      db.all('select id, name, description from payment_terms', function (err, allRows) {
        if (err != null) {
          commit('PAYMENT_TERM_SQLLIST', err)
        }
        commit('PAYMENT_TERM_LIST2', allRows)
      })
    })
  },
  createPaymentTerm ({ commit }, paymentTerm) {
    commit('PAYMENT_TERM_SQLCreate', PaymentTermSQLite.save(paymentTerm))
  },
  syncPaymentTerms ({ commit }, paymentTerms) {
    PaymentTermResource.all().then(response => {
      commit('PAYMENT_TERM_SQLSync', PaymentTermSQLite.syncNew(response.data.data))
    })
  },
  serverPaymentTermPush ({ commit }) {
    db.serialize(function () {
      db.all('select * from payment_terms where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('PAYMENT_TERM_SQLPush', err)
        }
        PaymentTermResource.serverPush(allRows)
        commit('PAYMENT_TERM_SQLPush', allRows)
      })
    })
  },
  getPaymentTerms ({ commit }, page = 1) {
    PaymentTermResource.all(page).then(response => {
      commit('PAYMENT_TERM_LIST', response.data.data)
    })
  }
}

// getters are functions
const getters = {
  paymentTerms: state => state.paymentTerms
}

export default {
  state,
  getters,
  mutations,
  actions
}
