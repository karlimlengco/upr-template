import SignatoryResource from '../../api/signatory'
import SignatorySQLite from '../../sqlite/signatory'
import { db } from '../../../server/db.js'



const state = {
  signatories: []
}

const mutations = {
  SIGNATORY_SQLLIST (state, signatories) {
    state.signatories = signatories
  },
  SIGNATORY_LIST (state, signatories) {
    state.signatories = signatories
  },
  SIGNATORY_LIST2 (state, signatories) {
    state.signatories = signatories
  },
  SIGNATORY_SQLCreate_New (state, signatory) {
    state.signatories.push(signatory)
  },
  SIGNATORY_SQLCreate (state, signatory) {
    // state.signatories.push(signatory)
  },
  SIGNATORY_SQLSync (state, signatory) {
    // state.signatories.push(signatory)
  },
  SIGNATORY_SQLPush (state, signatory) {
    // state.signatories.push(signatory)
  }
}

const actions = {
  listSignatory ({ commit }, [page = 0, q = ""]) {
    // commit('SIGNATORY_SQLLIST', SignatorysQLite.getAll(page))
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select * from signatories WHERE name LIKE ?1 OR ranks LIKE ?1 OR branch LIKE ?1 OR designation LIKE ?1 LIMIT 20 OFFSET ' + page,  {1: query}, function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('SIGNATORY_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('SIGNATORY_SQLLIST', data)
      })
    })
  },
  dropdownSignatory ({ commit }, page = 1) {
    // commit('SIGNATORY_SQLLIST', SignatorySQLite.getAll(page))
    db.serialize(function () {
      db.all('select id, name, branch, ranks, designation from signatories', function (err, allRows) {
        if (err != null) {
          commit('SIGNATORY_SQLLIST', err)
        }
        commit('SIGNATORY_LIST2', allRows)
      })
    })
  },
  createSignatory ({ commit }, signatory) {
    var fields = []
    var values = []
    var placeholder = ""
    var count = 0
    for (var key in signatory) {
      if (count == 0) {
        placeholder += "?"
      } else {
        placeholder += ",?"
      }
      count ++

      fields.push(key)
      values.push(signatory[key])
    }
    db.serialize(function () {
      db.run("INSERT INTO signatories (" + fields.join() + ") VALUES (" + placeholder + ")", values, function (err, row) {
        if (err) {
          console.log(err)
        }
        db.get('select * from signatories order by created_at desc limit 1', function (err, allRows) {
          if (err != null) {
            commit('RFQ_LIST', err)
          }
          commit('SIGNATORY_SQLCreate_New', allRows)
        })
        // commit('SIGNATORY_SQLCreate_New', row)
      })
    })

  },
  updateSignatory ({ commit }, [id, model]) {
    var fields = []
    var values = []
    for (var key in model) {
      fields.push(key+' = ?')
      values.push(model[key])
    }
    values.push(id)

    db.serialize(function () {
      db.parallelize(function () {
        db.run("UPDATE signatories SET " + fields.join(',') + " WHERE id = ?", values, function(err, row) {
          if (err == null) {
            db.get('select * from signatories where id =?', {1: id}, function (err, allRows) {
              if (err != null) {
                console.log(err)
              }
              console.log(allRows)
              commit('SIGNATORY_LIST', allRows)
            })
          }
        })
      })
    })
  },
  syncSignatory ({ commit }, signatories) {
    SignatoryResource.all().then(response => {
      commit('SIGNATORY_SQLSync', SignatorySQLite.syncNew(response.data.data))
    })
  },
  deleteSignatory ({ commit }, item) {
    commit('SIGNATORY_SQLCreate', SignatorySQLite.delete(item))
  },
  serverSignatoryPush ({ commit }) {
    db.serialize(function () {
      db.all('select * from signatories where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('SIGNATORY_SQLPush', err)
        }
        SignatoryResource.serverPush(allRows)
        commit('SIGNATORY_SQLPush', allRows)
      })
    })
  },
  getSignatory ({ commit }, page = 1) {
    SignatoryResource.all(page).then(response => {
      commit('SIGNATORY_LIST', response.data.data)
    })
  }
}

// getters are functions
const getters = {
  signatories: state => state.signatories
}

export default {
  state,
  getters,
  mutations,
  actions
}
