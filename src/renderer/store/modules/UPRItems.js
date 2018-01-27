import UPRITEMResource from '../../api/items'
import UprItemSQLite from '../../sqlite/items'
import { db } from '../../../server/db.js'


const state = {
  uprItems: []
}

const mutations = {
  UPRITEM_SQLLIST (state, uprItems) {
    state.uprItems = uprItems
  },
  UPRITEM_LIST (state, uprItems) {
    state.uprItems = uprItems
  },
  UPRITEM_LIST2 (state, uprItems) {
    state.uprItems = uprItems
  },
  UPRITEM_SQLCreate (state, uprItem) {
    // state.uprItems.push(uprItem)
  },
  UPRITEM_SQLSync (state, uprItem) {
    // state.uprItems.push(uprItem)
  },
  UPRITEM_SQLPush (state, uprItem) {
    // state.uprItems.push(uprItem)
  }
}

const actions = {
  listUprItems ({ commit }, page = 0) {
    var data = {}
    db.serialize(function () {
      db.all('select * from unit_purchase_request_items limit 20 offset ' + page, function (err, allRows) {
        if (err != null) {
          commit('UPRITEM_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('UPRITEM_SQLLIST', data)
      })
    })
  },
  updateUprItem ({ commit }, [id, model, upr_id]) {
    // commit('UPR_SQLCreate', UprSQLite.update(id, model))

    var fields = []
    var values = []
    for (var key in model) {
      fields.push(key+' = ?')
      // if(key == 'unit_price')
      // {
      //   var price  = model[key]
      //   price = price.replace(/,/g , "");
      //   values.push(price)
      // }
      // else
      // {
        values.push(model[key])
      // }
    }
    values.push(id)
    var newVal = '"' + values.join('","') + '"'

    db.serialize(function () {
      db.parallelize(function () {
        db.run("UPDATE unit_purchase_request_items SET " + fields.join(',') + " WHERE id = ?", values, function(err, row) {
          if (err == null) {
            db.all('select unit_purchase_request_items.*, account_codes.new_account_code as new_account_code_name, account_codes.old_account_code as old_account_code_name, account_codes.name as name_name  FROM unit_purchase_request_items LEFT JOIN account_codes ON account_codes.id = unit_purchase_request_items.new_account_code WHERE unit_purchase_request_items.upr_id=?', {1: upr_id}, function (err, allRows) {
              if (err != null) {
                console.log(err)
                commit('UPRITEM_SQLLIST', err)
              }
              commit('UPRITEM_SQLLIST', allRows)
            })
          }
        })
      })
    })
  },
  getUprItem ({ commit }, id) {
    db.serialize(function () {
      db.all('select unit_purchase_request_items.*, account_codes.new_account_code as new_account_code_name, account_codes.old_account_code as old_account_code_name, account_codes.name as name_name FROM unit_purchase_request_items LEFT JOIN account_codes ON account_codes.id = unit_purchase_request_items.new_account_code WHERE unit_purchase_request_items.upr_id=?', {1: id}, function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('UPRITEM_SQLLIST', err)
        }
        commit('UPRITEM_SQLLIST', allRows)
      })
    })
  },
  dropdownUprItems ({ commit }, page = 1) {
    db.serialize(function () {
      db.all('select * from unit_purchase_request_items', function (err, allRows) {
        if (err != null) {
          commit('UPRITEM_SQLLIST', err)
        }
        commit('UPRITEM_LIST2', allRows)
      })
    })
  },
  createUprItem ({ commit }, [upr, upr_id]) {
    // commit('UPRITEM_SQLCreate', UprItemSQLite.save(upr))
      for (var key in upr) {
        var fields = []
        var values = []
        var placeholder = ""
        var count = 0

        for (var key2 in upr[key]) {
          if (count == 0) {
            placeholder += "?"
          } else {
            placeholder += ",?"
          }
          count ++
          fields.push(key2)
          values.push(upr[key][key2])
        }

        var newVal = '"' + values.join('","') + '"'
        db.serialize(function () {
          db.run('INSERT INTO unit_purchase_request_items (' + fields.join() + ') VALUES (' + placeholder + ')', values, function (err, row) {
            if (err) {
              console.log(err)
            }
            
            db.all('select unit_purchase_request_items.*, account_codes.new_account_code as new_account_code_name, account_codes.old_account_code as old_account_code_name, account_codes.name as name_name  FROM unit_purchase_request_items LEFT JOIN account_codes ON account_codes.id = unit_purchase_request_items.new_account_code WHERE unit_purchase_request_items.upr_id=?', {1: upr_id}, function (err, allRows) {
              if (err != null) {
                console.log(err)
                commit('UPRITEM_SQLLIST', err)
              }
              console.log(allRows)
              commit('UPRITEM_SQLLIST', allRows)
            })
          })
        })
      }
  },
  deleteUprItem ({ commit }, [id, upr_id]) {
    db.serialize(function () {
      db.get('DELETE from unit_purchase_request_items WHERE id = ?1', [id], function (err, allRows) {
        if (err != null) {
          commit('UPRITEM_SQLLIST', err)
          console.log(err)
        }

        db.all('select unit_purchase_request_items.*, account_codes.new_account_code as new_account_code_name, account_codes.old_account_code as old_account_code_name, account_codes.name as name_name  FROM unit_purchase_request_items LEFT JOIN account_codes ON account_codes.id = unit_purchase_request_items.new_account_code WHERE unit_purchase_request_items.upr_id=?', {1: upr_id}, function (err, allRows) {
          if (err != null) {
            console.log(err)
            commit('UPRITEM_SQLLIST', err)
          }
          commit('UPRITEM_SQLLIST', allRows)
        })

      })
    })
  },
  syncUprItems ({ commit }, uprs) {
    UPRITEMResource.all().then(response => {
      commit('UPRITEM_SQLSync', UprItemSQLite.syncNew(response.data.data))
    })
  },
  serverUprItemPush ({ commit }) {
    // commit('UPRITEM_SQLPush', UprItemSQLite.serverPush(UprItemSQLite.getNew()))
    db.serialize(function () {
      db.all('select * from unit_purchase_request_items where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('UPRITEM_SQLPush', err)
        }
        UPRITEMResource.serverPush(allRows)
        commit('UPRITEM_SQLPush', allRows)
      })
    })
  },
  getUprItems ({ commit }, page = 1) {
    UPRITEMResource.all(page).then(response => {
      commit('UPRITEM_LIST', response.data.data)
    })
  }
}

// getters are functions
const getters = {
  uprItems: state => state.uprItems
}

export default {
  state,
  getters,
  mutations,
  actions
}
