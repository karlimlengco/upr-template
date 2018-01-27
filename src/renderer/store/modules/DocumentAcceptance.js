import DocumentAcceptanceResource from '../../api/document-acceptance'
import DocumentAcceptanceSQLite from '../../sqlite/document-acceptance'
import { db } from '../../../server/db.js'

const state = {
  documentAcceptance: []
}

const mutations = {
  DOCUMENTACCEPTANCE_SQLLIST (state, docAcceptance) {
    state.documentAcceptance = docAcceptance
  },
  DOCUMENTACCEPTANCE_LIST (state, docAcceptance) {
    state.documentAcceptance = docAcceptance
  },
  DOCUMENTACCEPTANCE_SQLCreate (state, docAcceptance) {
    // state.docAcceptance.push(docAcceptance)
  },
  DOCUMENTACCEPTANCE_SQLSync (state, docAcceptance) {
    // state.puchase_orders.push(docAcceptance)
  },
  DOCUMENTACCEPTANCE_SQLPush (state, docAcceptance) {
    // state.POs.push(docAcceptance)
  }
}

const actions = {
  listDocumentAcceptance ({ commit }, [page = 0, q = ""]) {
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select * from document_acceptance WHERE return_remarks LIKE ?1 OR return_date LIKE ?1 OR approved_date LIKE ?1 OR pre_proc_date LIKE ?1 OR upr_number LIKE ?1 OR ref_number LIKE ?1 LIMIT 20 OFFSET ' + page, {1: query},function (err, allRows) {
        if (err != null) {
          commit('DOCUMENTACCEPTANCE_SQLLIST', err)
          console.log(err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('DOCUMENTACCEPTANCE_SQLLIST', data)
      })
    })
  },
  createDocumentAcceptance ({ commit }, docAcceptance) {
    commit('DOCUMENTACCEPTANCE_SQLCreate', DocumentAcceptanceSQLite.save(docAcceptance))
  },
  updateDocumentAcceptance ({ commit }, [id, docAcceptance]) {
    commit('DOCUMENTACCEPTANCE_SQLCreate', DocumentAcceptanceSQLite.update(id, docAcceptance))
  },
  syncDocumentAcceptance ({ commit }, docAcceptance) {
    DocumentAcceptanceResource.all().then(response => {
      commit('DOCUMENTACCEPTANCE_SQLSync', DocumentAcceptanceSQLite.syncNew(response.data.data))
    })
  },
  serverDocumentAcceptancePush ({ commit }) {
    // commit('DOCUMENTACCEPTANCE_SQLPush', DocumentAcceptanceSQLite.serverPush(DocumentAcceptanceSQLite.getNew()))
    db.serialize(function () {
      db.all('select * from document_acceptance where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('DOCUMENTACCEPTANCE_SQLPush', err)
        }
        DocumentAcceptanceResource.serverPush(allRows)
        commit('DOCUMENTACCEPTANCE_SQLPush', allRows)
        // DocumentAcceptanceSQLite.markAsSync(allRows)
      })
    })
  },
  getDocumentAcceptance ({ commit }, id) {
    db.serialize(function () {
      db.get('select document_acceptance.* from document_acceptance where document_acceptance.id =?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('DOCUMENTACCEPTANCE_LIST', err)
        }
        commit('DOCUMENTACCEPTANCE_LIST', allRows)
      })
    })
  },
  getDocumentAcceptanceByUPR ({ commit }, id) {
    db.serialize(function () {
      db.get('select document_acceptance.* from document_acceptance LEFT JOIN purchase_orders ON purchase_orders.upr_id = unit_purchase_requests.id LEFT JOIN unit_purchase_requests on document_acceptance.upr_id = unit_purchase_requests.id where document_acceptance.upr_id =? ', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('DOCUMENTACCEPTANCE_LIST', err)
        }
        commit('DOCUMENTACCEPTANCE_LIST', allRows)
      })
    })
  }
}

// getters are functions
const getters = {
  documentAcceptance: state => state.documentAcceptance
}

export default {
  state,
  getters,
  mutations,
  actions
}
