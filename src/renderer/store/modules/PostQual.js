import PostQualResource from '../../api/post-qual'
import PostQualSQLite from '../../sqlite/post-qual'
import { db } from '../../../server/db.js'

const state = {
  postQual: []
}

const mutations = {
  POSTQUAL_SQLLIST (state, post_qualification) {
    state.postQual = post_qualification
  },
  POSTQUAL_LIST (state, post_qualification) {
    state.postQual = post_qualification
  },
  POSTQUAL_SQLCreate (state, post_qualification) {
    // state post_qualification.push post_qualification)
  },
  POSTQUAL_SQLSync (state, post_qualification) {
    // state.puchase_orders.push post_qualification)
  },
  POSTQUAL_SQLPush (state, post_qualification) {
    // state.POs.push post_qualification)
  }
}

const actions = {
  listPostQual ({ commit }, [page = 0, q = ""]) {
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select * from post_qualification  WHERE upr_number LIKE ?1 OR transaction_date LIKE ?1 OR ref_number LIKE ?1 LIMIT 20 OFFSET '+ page, {1: query},   function (err, allRows) {
        if (err != null) {
          commit('POSTQUAL_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('POSTQUAL_SQLLIST', data)
      })
    })
  },
  createPostQual ({ commit }, post_qualification) {
    commit('POSTQUAL_SQLCreate', PostQualSQLite.save(post_qualification))
  },
  updatePostQual ({ commit }, [id, post_qualification]) {
    commit('POSTQUAL_SQLCreate', PostQualSQLite.update(id, post_qualification))
  },
  syncPostQual ({ commit }, post_qualification) {
    PostQualResource.all().then(response => {
      commit('POSTQUAL_SQLSync', PostQualSQLite.syncNew(response.data.data))
    })
  },
  serverPostQualPush ({ commit }) {
    // commit('POSTQUAL_SQLPush', PostQualSQLite.serverPush(PostQualSQLite.getNew()))
    db.serialize(function () {
      db.all('select * from post_qualification where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('POSTQUAL_SQLPush', err)
        }
        PostQualResource.serverPush(allRows)
        commit('POSTQUAL_SQLPush', allRows)
        // PostQualSQLite.markAsSync(allRows)
      })
    })
  },
  getPostQual ({ commit }, id) {
    db.serialize(function () {
      db.get('select post_qualification.* from post_qualification where post_qualification.id =?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('POSTQUAL_LIST', err)
        }
        commit('POSTQUAL_LIST', allRows)
      })
    })
  },
  getPostQualByUpr ({ commit }, id) {
    db.serialize(function () {
      db.get('select post_qualification.* from post_qualification where post_qualification.upr_id =?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('POSTQUAL_LIST', err)
        }
        commit('POSTQUAL_LIST', allRows)
      })
    })
  }
}

// getters are functions
const getters = {
  postQual: state => state.postQual
}

export default {
  state,
  getters,
  mutations,
  actions
}
