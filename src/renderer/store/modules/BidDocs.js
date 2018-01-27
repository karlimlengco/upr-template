import BidDocsResource from '../../api/bid-docs'
import BidDocsSQLite from '../../sqlite/bid-docs'
import { db } from '../../../server/db.js'

const state = {
  bidDocuments: []
}

const mutations = {
  BID_DOCS_SQLLIST (state, bid_document) {
    state.bidDocuments = bid_document
  },
  BID_DOCS_LIST (state, bid_document) {
    state.bidDocuments = bid_document
  },
  BID_DOCS_SQLCreate (state, bid_document) {
    // state.bid_document.push(bid_document)
  },
  BID_DOCS_SQLSync (state, bid_document) {
    // state.puchase_orders.push(bid_document)
  },
  BID_DOCS_SQLPush (state, bid_document) {
    // state.POs.push(bid_document)
  }
}

const actions = {
  listBidDocs ({ commit }, [page = 0, q = ""]) {
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select * from bid_docs_issuance WHERE ref_number LIKE ?1 OR upr_number LIKE ?1 OR proponent_name LIKE ?1 OR transaction_date LIKE ?1 LIMIT 20 OFFSET '+ page, {1: query},  function (err, allRows) {
        if (err != null) {
          commit('BID_DOCS_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('BID_DOCS_SQLLIST', data)
      })
    })
  },
  createBidDocs ({ commit }, bid_document) {
    commit('BID_DOCS_SQLCreate', BidDocsSQLite.save(bid_document))
  },
  updateBidDocs ({ commit }, [id, model]) {
    commit('BID_DOCS_SQLCreate', BidDocsSQLite.update(id, model))
  },
  syncBidDocs ({ commit }, bid_document) {
    BidDocsResource.all().then(response => {
      commit('BID_DOCS_SQLSync', BidDocsSQLite.syncNew(response.data.data))
    })
  },
  serverBidDocsPush ({ commit }) {
    // commit('BID_DOCS_SQLPush', BidDocsSQLite.serverPush(BidDocsSQLite.getNew()))
    db.serialize(function () {
      db.all('select * from bid_docs_issuance where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('BID_DOCS_SQLPush', err)
        }
        BidDocsResource.serverPush(allRows)
        commit('BID_DOCS_SQLPush', allRows)
        // BidDocsSQLite.markAsSync(allRows)
      })
    })
  },
  getBidDocs ({ commit }, id) {
    db.serialize(function () {
      db.get('select bid_docs_issuance.* from bid_docs_issuance where bid_docs_issuance.id =?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('BID_DOCS_LIST', err)
        }
        commit('BID_DOCS_LIST', allRows)
      })
    })
  },
  getBidDocsWithSupplier ({ commit }, id) {
    db.serialize(function () {
      db.get('select bid_docs_issuance.*, suppliers.name, suppliers.owner, suppliers.address, suppliers.tin, suppliers.cell_1, suppliers.phone_1, suppliers.fax_1, suppliers.email_1 from bid_docs_issuance LEFT JOIN suppliers ON bid_docs_issuance.proponent_id = suppliers.id where bid_docs_issuance.id=?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('BID_DOCS_LIST', err)
        }
        commit('BID_DOCS_LIST', allRows)
      })
    })
  },
  getBidDocsByUPR ({ commit }, id) {
    db.serialize(function () {
      db.all('select * from bid_docs_issuance  where upr_id =?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('BID_DOCS_LIST', err)
        }
        commit('BID_DOCS_LIST', allRows)
      })
    })
  },
  getBidDocsWinner ({ commit }, id) {
    db.serialize(function () {
      db.get('select notice_of_awards.*, bid_docs_issuance.bid_amount, suppliers.name, suppliers.owner, suppliers.address, suppliers.tin, suppliers.cell_1, suppliers.phone_1, suppliers.fax_1, suppliers.email_1 from notice_of_awards LEFT JOIN bid_docs_issuance on bid_docs_issuance.id = notice_of_awards.proponent_id LEFT JOIN suppliers ON bid_docs_issuance.proponent_id = suppliers.id where notice_of_awards.upr_id=?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('BID_DOCS_LIST', err)
        }
        commit('BID_DOCS_LIST', allRows)
      })
    })
  },
}

// getters are functions
const getters = {
  bidDocuments: state => state.bidDocuments
}

export default {
  state,
  getters,
  mutations,
  actions
}
