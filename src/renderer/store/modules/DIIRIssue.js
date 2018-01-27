import DIIRIssueResource from '../../api/diir-issue'
import DIIRSQLite from '../../sqlite/diir-issue'
import { db } from '../../../server/db.js'

const state = {
  deliveryInspectionIssue: []
}

const mutations = {
  DIIRISSUE_SQLLIST (state, inspection_issues) {
    state.deliveryInspectionIssue = inspection_issues
  },
  DIIRISSUE_LIST (state, inspection_issues) {
    state.deliveryInspectionIssue = inspection_issues
  },
  DIIRISSUE_SQLCreate (state, inspection_issues) {
    // state.inspection_issues.push(inspection_issues)
  },
  DIIRISSUE_SQLSync (state, inspection_issues) {
    // state.puchase_orders.push(inspection_issues)
  },
  DIIRISSUE_SQLPush (state, inspection_issues) {
    // state.POs.push(inspection_issues)
  }
}

const actions = {
  listDIIRIssue ({ commit }, page = 1) {
    var data = {}
    db.serialize(function () {
      db.all('select * from inspection_issues', function (err, allRows) {
        if (err != null) {
          commit('DIIRISSUE_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('DIIRISSUE_SQLLIST', data)
      })
    })
  },
  createDIIRIssue ({ commit }, inspection_issues) {
    commit('DIIRISSUE_SQLCreate', DIIRSQLite.save(inspection_issues))
  },
  syncDIIRIssue ({ commit }, inspection_issues) {
    DIIRIssueResource.all().then(response => {
      commit('DIIRISSUE_SQLSync', DIIRSQLite.syncNew(response.data.data))
    })
  },
  serverDIIRIssuePush ({ commit }) {
    // commit('DIIRISSUE_SQLPush', DIIRSQLite.serverPush(DIIRSQLite.getNew()))
    db.serialize(function () {
      db.all('select * from inspection_issues where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('DIIRISSUE_SQLPush', err)
        }
        DIIRIssueResource.serverPush(allRows)
        commit('DIIRISSUE_SQLPush', allRows)
        // DIIRSQLite.markAsSync(allRows)
      })
    })
  },
  getDIIRIssue ({ commit }, id) {
    db.serialize(function () {
      db.get('select inspection_issues.* from inspection_issues where inspection_issues.id =?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('DIIRISSUE_LIST', err)
        }
        commit('DIIRISSUE_LIST', allRows)
      })
    })
  },
  getDIIRIssueByOrder ({ commit }, id) {
    db.serialize(function () {
      db.all('select * from inspection_issues where inspection_issues.inspection_id =?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('DIIRISSUE_LIST', err)
        }
        commit('DIIRISSUE_LIST', allRows)
      })
    })
  }
}

// getters are functions
const getters = {
  deliveryInspectionIssue: state => state.deliveryInspectionIssue
}

export default {
  state,
  getters,
  mutations,
  actions
}
