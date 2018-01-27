import IAARInvoiceResource from '../../api/inspection-report-invoice'
import IAARInvoiceSQLite from '../../sqlite/inspection-report-invoice'
import { db } from '../../../server/db.js'

const state = {
  inspectionReportInvoice: []
}

const mutations = {
  IAARINVOICE_SQLLIST (state, inspection_report_invoice) {
    state.inspectionReportInvoice = inspection_report_invoice
  },
  IAARINVOICE_LIST (state, inspection_report_invoice) {
    state.inspectionReportInvoice = inspection_report_invoice
  },
  IAARINVOICE_SQLCreate (state, inspection_report_invoice) {
    // state.inspection_report_invoice.push(inspection_report_invoice)
  },
  IAARINVOICE_SQLSync (state, inspection_report_invoice) {
    // state.puchase_orders.push(inspection_report_invoice)
  },
  IAARINVOICE_SQLPush (state, inspection_report_invoice) {
    // state.POs.push(inspection_report_invoice)
  }
}

const actions = {
  listIAARInvoice ({ commit }, page = 1) {
    var data = {}
    db.serialize(function () {
      db.all('select * from inspection_acceptance_invoices', function (err, allRows) {
        if (err != null) {
          commit('IAARINVOICE_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('IAARINVOICE_SQLLIST', data)
      })
    })
  },
  createIAARInvoice ({ commit }, inspection_report_invoice) {
    commit('IAARINVOICE_SQLCreate', IAARInvoiceSQLite.save(inspection_report_invoice))
  },
  syncIAARInvoice ({ commit }, inspection_report_invoice) {
    IAARInvoiceResource.all().then(response => {
      commit('IAARINVOICE_SQLSync', IAARInvoiceSQLite.syncNew(response.data.data))
    })
  },
  serverIAARInvoicePush ({ commit }) {
    // commit('IAARINVOICE_SQLPush', IAARInvoiceSQLite.serverPush(IAARInvoiceSQLite.getNew()))
    db.serialize(function () {
      db.all('select * from inspection_acceptance_invoices where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('IAARINVOICE_SQLPush', err)
        }
        IAARInvoiceResource.serverPush(allRows)
        commit('IAARINVOICE_SQLPush', allRows)
        // IAARInvoiceSQLite.markAsSync(allRows)
      })
    })
  },
  getIAARInvoice ({ commit }, id) {
    db.serialize(function () {
      db.get('select inspection_acceptance_invoices.* from inspection_acceptance_invoices where inspection_acceptance_invoices.id =?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('IAARINVOICE_LIST', err)
        }
        commit('IAARINVOICE_LIST', allRows)
      })
    })
  },
  getIAARInvoiceByOrder ({ commit }, id) {
    db.serialize(function () {
      db.all('select * from inspection_acceptance_invoices where inspection_acceptance_invoices.acceptance_id =?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('IAARINVOICE_LIST', err)
        }
        commit('IAARINVOICE_LIST', allRows)
      })
    })
  }
}

// getters are functions
const getters = {
  inspectionReportInvoice: state => state.inspectionReportInvoice
}

export default {
  state,
  getters,
  mutations,
  actions
}
