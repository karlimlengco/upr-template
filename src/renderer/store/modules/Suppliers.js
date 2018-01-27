import SupplierResource from '../../api/suppliers'
import SuppliersQLite from '../../sqlite/suppliers'
import { db } from '../../../server/db.js'


const state = {
  suppliers: []
}

const mutations = {
  SUPPLIER_SQLLIST (state, suppliers) {
    state.suppliers = suppliers
  },
  SUPPLIER_LIST (state, suppliers) {
    state.suppliers = suppliers
  },
  SUPPLIER_LIST2 (state, suppliers) {
    state.suppliers = suppliers
  },
  SUPPLIER_SQLCreate (state, supplier) {
    // state.Suppliers.push(supplier)
  },
  SUPPLIER_SQLSync (state, supplier) {
    // state.Suppliers.push(supplier)
  },
  SUPPLIER_SQLPush (state, supplier) {
    // state.Suppliers.push(supplier)
  }
}

const actions = {
  listSuppliers ({ commit }, [page = 0, q = ""]) {
    // commit('SUPPLIER_SQLLIST', SuppliersQLite.getAll(page))
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select * from suppliers WHERE name LIKE ?1 OR owner LIKE ?1 OR address LIKE ?1 LIMIT 20 OFFSET '+ page, {1: query}, function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('SUPPLIER_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('SUPPLIER_SQLLIST', data)
      })
    })
  },
  dropdownSuppliers ({ commit }, page = 1) {
    // commit('SUPPLIER_SQLLIST', SuppliersQLite.getAll(page))
    db.serialize(function () {
      db.all('select * from suppliers LIMIT 100', function (err, allRows) {
        if (err != null) {
          commit('SUPPLIER_SQLLIST', err)
        }
        commit('SUPPLIER_LIST2', allRows)
      })
    })
  },
  createSupplier ({ commit }, supplier) {
    commit('SUPPLIER_SQLCreate', SuppliersQLite.save(supplier))
  },
  syncSuppliers ({ commit }, suppliers) {
    SupplierResource.all().then(response => {
      commit('SUPPLIER_SQLSync', SuppliersQLite.syncNew(response.data.data))
    })
  },
  serverSupplierPush ({ commit }) {
    // commit('SUPPLIER_SQLPush', SuppliersQLite.serverPush(SuppliersQLite.getNew()))
    db.serialize(function () {
      db.all('select * from suppliers where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('SUPPLIER_SQLPush', err)
        }
        SupplierResource.serverPush(allRows)
        commit('SUPPLIER_SQLPush', allRows)
      })
    })
  },
  getSupplier ({ commit }, id) {
    db.serialize(function () {
      db.get('select * from suppliers where id=?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('SUPPLIER_LIST', err)
        }
        commit('SUPPLIER_LIST', allRows)
      })
    })
  },
  getSuppliers ({ commit }, page = 1) {
    SupplierResource.all(page).then(response => {
      commit('SUPPLIER_LIST', response.data.data)
    })
  }
}

// getters are functions
const getters = {
  suppliers: state => state.suppliers
}

export default {
  state,
  getters,
  mutations,
  actions
}
