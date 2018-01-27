import AccountResource from '../../api/account'
import AccountSQLite from '../../sqlite/account'
import { db } from '../../../server/db.js'



const state = {
  accountCodes: [],
  codeInfo: [],
  codesList: [],
}

const mutations = {
  ACCOUNT_SQLLIST (state, accountCodes) {
    state.accountCodes = accountCodes
  },
  ACCOUNT_SQLLIST2 (state, codesList) {
    state.codesList = codesList
  },
  ACCOUNT_LIST (state, accountCodes) {
    state.accountCodes = accountCodes
  },
  ACCOUNT_LIST2 (state, accountCodes) {
    state.accountCodes = accountCodes
  },
  ACCOUNT_INFO (state, codeInfo) {
    state.codeInfo = codeInfo
  },
  ACCOUNT_SQLCreate (state, account) {
    // state.accountCodes.push(account)
  },
  ACCOUNT_SQLSync (state, account) {
    // state.accountCodes.push(account)
  },
  ACCOUNT_SQLPush (state, account) {
    // state.accountCodes.push(account)
  }
}

const actions = {
  getAccountById ({ commit }, id) {
    // commit('ACCOUNT_SQLLIST', AccountsQLite.getAll(page))
    var data = {}
    db.serialize(function () {
      db.get('select * from account_codes WHERE id = ?', id, function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('ACCOUNT_INFO', err)
        }
        console.log(allRows)
        commit('ACCOUNT_INFO', data)
      })
    })
  },
  listAccounts ({ commit }, [page = 0, q = ""]) {
    // commit('ACCOUNT_SQLLIST', AccountsQLite.getAll(page))
    var data = {}
    var query  =  "%"+ q +"%"
    db.serialize(function () {
      db.all('select * from account_codes WHERE name LIKE ?1 OR new_account_code LIKE ?1 OR old_account_code LIKE ?1 limit 20 offset ' + page, {1: query}, function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('ACCOUNT_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('ACCOUNT_SQLLIST', data)
      })
    })
  },
  dropAccounts ({ commit }, q = '') {
    var query  =  "%"+ q +"%"
    // commit('ACCOUNT_SQLLIST', AccountsQLite.getAll(page))
    var data = {}
    db.serialize(function () {
      db.all('select * from account_codes WHERE name LIKE ?1 OR new_account_code LIKE ?1 OR old_account_code LIKE ?1', {1: query}, function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('ACCOUNT_SQLLIST2', err)
        }
        commit('ACCOUNT_SQLLIST2', allRows)
      })
    })
  },
  dropdownAccounts ({ commit }, page = 1) {
    // commit('ACCOUNT_SQLLIST', AccountSQLite.getAll(page))
    db.serialize(function () {
      db.all('select id, name, old_account_code, new_account_code from account_codes', function (err, allRows) {
        if (err != null) {
          commit('ACCOUNT_SQLLIST', err)
        }
        var data = []
        for (var keyVal in allRows) {
          data.push({
            'id': allRows[keyVal]['id'],
            'make': 'nac',
            'model': allRows[keyVal]['new_account_code']
          })

          data.push({
            'id': "old-"+allRows[keyVal]['id'],
            'make': 'oac',
            'model': allRows[keyVal]['old_account_code']
          })

          data.push({
            'id': "title-"+allRows[keyVal]['id'],
            'make': 'title',
            'model': allRows[keyVal]['name']
          })
        }
          // data.push(
          //   {id: 'avenger', make: 'dodge', model: 'Avenger'}
          // )
        commit('ACCOUNT_LIST2', data)
      })
    })
  },
  createAccount ({ commit }, account) {
    commit('ACCOUNT_SQLCreate', AccountSQLite.save(account))
  },
  syncAccounts ({ commit }, accountCodes) {
    AccountResource.all().then(response => {
      commit('ACCOUNT_SQLSync', AccountSQLite.syncNew(response.data.data))
    })
  },
  serverAccountPush ({ commit }) {
    // commit('ACCOUNT_SQLPush', AccountsQLite.serverPush(AccountSQLite.getNew()))
    db.serialize(function () {
      db.all('select * from account_codes where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('ACCOUNT_SQLPush', err)
        }
        AccountResource.serverPush(allRows)
        commit('ACCOUNT_SQLPush', allRows)
      })
    })
  },
  getAccounts ({ commit }, page = 1) {
    AccountResource.all(page).then(response => {
      commit('ACCOUNT_LIST', response.data.data)
    })
  }
}

// getters are functions
const getters = {
  accountCodes: state => state.accountCodes,
  codesList: state => state.codesList,
  codeInfo: state => state.codeInfo
}

export default {
  state,
  getters,
  mutations,
  actions
}
