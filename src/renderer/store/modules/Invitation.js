import InvitationResource from '../../api/invitation'
import InvitationSQLite from '../../sqlite/invitation'
import { db } from '../../../server/db.js'

const state = {
  invitations: []
}

const mutations = {
  INVITATION_SQLLIST (state, invitation) {
    state.invitations = invitation
  },
  INVITATION_LIST (state, invitation) {
    state.invitations = invitation
  },
  INVITATION_SQLCreate (state, invitation) {
    // state.Invitation.push(invitation)
  },
  INVITATION_SQLSync (state, invitation) {
    // state.puchase_orders.push(invitation)
  },
  INVITATION_SQLPush (state, invitation) {
    // state.POs.push(invitation)
  }
}

const actions = {
  listInvitation ({ commit }, page = 1) {
    var data = {}
    db.serialize(function () {
      db.all('select * from invitation_for_quotation', function (err, allRows) {
        if (err != null) {
          commit('INVITATION_SQLLIST', err)
        }
        data = {
          'data': allRows,
          'pagination': ''
        }
        commit('INVITATION_SQLLIST', data)
      })
    })
  },
  createInvitation ({ commit }, invitation) {
    commit('INVITATION_SQLCreate', InvitationSQLite.save(invitation))
  },
  syncInvitation ({ commit }, invitation) {
    InvitationResource.all().then(response => {
      commit('INVITATION_SQLSync', InvitationSQLite.syncNew(response.data.data))
    })
  },
  serverInvitationPush ({ commit }) {
    // commit('INVITATION_SQLPush', InvitationSQLite.serverPush(InvitationSQLite.getNew()))
    db.serialize(function () {
      db.all('select * from invitation_for_quotation where is_sync is null', function (err, allRows) {
        if (err != null) {
          console.log(err)
          commit('INVITATION_SQLPush', err)
        }
        InvitationResource.serverPush(allRows)
        commit('INVITATION_SQLPush', allRows)
        // InvitationSQLite.markAsSync(allRows)
      })
    })
  },
  getInvitation ({ commit }, id) {
    db.serialize(function () {
      db.get('select invitation_for_quotation.* from invitation_for_quotation where invitation_for_quotation.id =?', {1: id}, function (err, allRows) {
        if (err != null) {
          commit('INVITATION_LIST', err)
        }
        commit('INVITATION_LIST', allRows)
      })
    })
  }
}

// getters are functions
const getters = {
  invitations: state => state.invitations
}

export default {
  state,
  getters,
  mutations,
  actions
}
