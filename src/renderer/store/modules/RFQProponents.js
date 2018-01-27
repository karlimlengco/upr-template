import RFQProponentsResource from '../../api/rfq-proponents'
import RFQProponentsSQLite from '../../sqlite/rfq-proponents'
import { db } from '../../../server/db.js'

const state = {
  rfqProponents: []
}

const mutations = {
  RFQPROPONENT_SQLLIST (state, rfqProponent) {
    state.rfqProponents = rfqProponent
  },
  RFQPROPONENT_LIST (state, rfqProponent) {
    state.rfqProponents = rfqProponent
  },
  RFQPROPONENT_SQLCreate (state, rfqProponent) {
    // state.rfq.push(rfqProponent)
  },
  RFQPROPONENT_SQLSync (state, rfqProponent) {
    // state.rfq.push(rfqProponent)
  },
  RFQPROPONENT_SQLPush (state, rfqProponent) {
    // state.rfq.push(rfqProponent)
  }
}

const actions = {
  listRFQProponent ({ commit }, page = 1) {
    var data = {}
    db.serialize(function () {
      db.all('select * from rfq_proponents', function (err, allRows) {
        if (err != null) {
          commit('RFQPROPONENT_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('RFQPROPONENT_SQLLIST', data)
      })
    })
  },
  createRFQProponent ({ commit }, rfqProponent) {
    commit('RFQPROPONENT_SQLCreate', RFQProponentsSQLite.save(rfqProponent))
  },
  updateRFQProponent ({ commit }, [id, model]) {
    commit('RFQPROPONENT_SQLCreate', RFQProponentsSQLite.update(id, model))
  },
  syncRFQProponent ({ commit }, rfqProponent) {
    RFQProponentsResource.all().then(response => {
      commit('RFQPROPONENT_SQLSync', RFQProponentsSQLite.syncNew(response.data.data))
    })
  },
  serverRFQProponentPush ({ commit }) {
    // commit('RFQPROPONENT_SQLPush', RFQProponentsSQLite.serverPush(RFQProponentsSQLite.getNew()))
    db.serialize(function () {
      db.all('select * from rfq_proponents where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('RFQPROPONENT_SQLPush', err)
        }
        RFQProponentsResource.serverPush(allRows)
        commit('RFQPROPONENT_SQLPush', allRows)
        // RFQProponentsSQLite.markAsSync(allRows)
      })
    })
  },
  getRFQProponent ({ commit }, id) {
    db.serialize(function () {
      db.get('select rfq_proponents.*, suppliers.name, suppliers.owner, suppliers.address, suppliers.tin, suppliers.cell_1, suppliers.phone_1, suppliers.fax_1, suppliers.email_1 from rfq_proponents LEFT JOIN suppliers ON rfq_proponents.proponents = suppliers.id where rfq_proponents.id=?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('RFQPROPONENT_LIST', err)
        }
        commit('RFQPROPONENT_LIST', allRows)
      })
    })
  },
  getRFQWinner ({ commit }, id) {
    db.serialize(function () {
      db.get('select notice_of_awards.*, rfq_proponents.bid_amount, suppliers.name, suppliers.owner, suppliers.address, suppliers.tin, suppliers.cell_1, suppliers.phone_1, suppliers.fax_1, suppliers.email_1 from notice_of_awards LEFT JOIN rfq_proponents on rfq_proponents.id = notice_of_awards.proponent_id LEFT JOIN suppliers ON rfq_proponents.proponents = suppliers.id where notice_of_awards.upr_id=?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('RFQPROPONENT_LIST', err)
        }
        commit('RFQPROPONENT_LIST', allRows)
      })
    })
  },
  getRFQProponentByProponent ({ commit }, id) {
    db.serialize(function () {
      db.all('select rfq_proponents.*, suppliers.name from rfq_proponents LEFT JOIN suppliers ON rfq_proponents.proponents = suppliers.id where rfq_id=? ', {1: id}, function (err, allRows) {
        console.log(allRows)
        if (err != null) {
          commit('RFQPROPONENT_LIST', err)
        }
        commit('RFQPROPONENT_LIST', allRows)
      })
    })
  }
}

// getters are functions
const getters = {
  rfqProponents: state => state.rfqProponents
}

export default {
  state,
  getters,
  mutations,
  actions
}
