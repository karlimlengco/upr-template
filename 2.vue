<template>
  <div id="app">
    <router-view></router-view>

    <div class="loader-container" v-if="loading" >

      <sync-loader :loading="loading" :color="color" :size="size"></sync-loader>
      <p>Syncing Please wait...</p>
    </div>
  </div>
</template>

<script>
  import store from './store'
  import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
  import axios from 'axios'
  import { API_ROOT } from '../config.js'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    methods: {
      ...mapActions([
        'listUsers',
        'syncISPQ',
        'syncNTP',
        'serverNTPPush',
        'syncRFQ',
        'serverRFQPush',
        'syncPhilgeps',
        'serverPhilgepsPush',
        'syncSuppliers',
        'syncCanvassing',
        'syncRFQProponent',
        'serverRFQProponentPush',
        'syncNOD',
        'syncNODItems',
        'serverUserPush',
        'serverUnitPush',
        'syncDIIR',
        'syncUserRoles',
        'syncUsers',
        'syncPreproc',
        'syncITB',
        'syncBidDocs',
        'syncSOBE',
        'syncPostQual',
        'syncPrebid',
        'syncNOA',
        'syncPermissions',
        'syncDocumentAcceptance',
        'syncVoucher',
        'syncRoles',
        'serverRolePush',
        'syncSignatory',
        'syncPO',
        'syncPOItem',
        'syncProcurementModes',
        'syncChargeabilitys',
        'syncPaymentTerms',
        'syncDIIRIssue',
        'syncProcurementTypes',
        'syncIAAR',
        'syncIAARInvoice',
        'serverPermissionPush',
        'syncUprs',
        'syncUprItems',
        'syncProcurements',
        'serverUprPush',
        'serverProcurementModePush',
        'serverProcurementTypePush',
        'serverPaymentTermPush',
        'serverUprItemPush',
        'serverChargeabilityPush',
        'serverProcurementPush',
        'serverSignatoryPush',
        'serverISPQPush',
        'serverPOPush',
        'serverPOItemPush',
        'serverCanvassingPush',
        'serverNOAPush',
        'syncInvitation',
        'serverInvitationPush',
        'syncUnits',
        'syncAccounts'
      ]),
      syncNewUser: function (items) {
        this.syncUsers(items)
      },
      loadData: function () {
        if (navigator.onLine) {
          // this.loading = true
          axios.get(API_ROOT + 'api/user-lists?token=' + localStorage.getItem('id_token'))
            .then(response => {
              this.items = response.data
              this.syncNewUser(this.items)
              // this.loading = false
              this.loadCount += 1
            })
        }
      },
      syncNewUnit: function () {
        this.syncUnits()
      }
    },
    mounted: function () {

      setInterval(function () {
        if (this.$route.path != '/') {
          this.loadCount = 0
          this.listUsers()

          this.loading = true
          this.syncISPQ().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncAccounts().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncDIIR().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncNTP().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.serverNTPPush().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncSuppliers().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncNOD().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncNODItems().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncIAAR().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncIAARInvoice().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncPreproc().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncITB().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncBidDocs().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncSOBE().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncPostQual().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncPrebid().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncRFQ().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.serverRFQPush().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncCanvassing().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncRFQProponent().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.serverRFQProponentPush().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncDocumentAcceptance().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncPhilgeps().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.serverPhilgepsPush().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncPermissions().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncDIIRIssue().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncUserRoles().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncProcurements().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncPO().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncPOItem().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncNOA().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncSignatory().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncRoles().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncVoucher().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncPaymentTerms().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncChargeabilitys().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncProcurementTypes().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncProcurementModes().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.serverProcurementTypePush().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncUprs().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncInvitation().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.syncUprItems().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.serverRolePush().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.serverChargeabilityPush().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.serverPaymentTermPush().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.serverCanvassingPush().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.serverNOAPush().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.serverPermissionPush().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.serverUnitPush().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.serverUserPush().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.serverProcurementModePush().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.serverProcurementPush().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.serverSignatoryPush().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.serverUprPush().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.serverISPQPush().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.serverPOPush().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.serverPOItemPush().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.serverInvitationPush().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          // this.loading = true
          this.serverUprItemPush().then(response => {
            // this.loading = false
            this.loadCount += 1
          })

          this.loadData()
          this.syncNewUnit()
        }

        if (this.loadCount == 58) {
          this.loading = false
        }
        console.log(this.loadCount)

      }.bind(this), 1000)
      // this.loading = true

    },
    data () {
      return {
        color: '#5dc596',
        size: '35px',
        loadCount: 0,
        loading: false
      }
    },
    components: { SyncLoader},
    store,
    name: 'appmis'
  }
  const isOnline = require('is-online');
  const {ipcRenderer} = require('electron')
  const alertOnlineStatus = () => {
    // console.log(navigator.onLine ? 'online' : 'offline')
    ipcRenderer.send('online-status-changed', navigator.onLine ? 'online' : 'offline')
  }

  setInterval(function () {
    isOnline().then(online => {
      console.log(online);
    });
  }.bind(this), 100000)

  window.addEventListener('online', alertOnlineStatus)
  window.addEventListener('offline', alertOnlineStatus)

  alertOnlineStatus()
</script>

<style>
  /* CSS */
  .loader-container{
    margin:0 auto;
    top:0;
    position: fixed;
    width: 100%;
    height: 100%;
    left:0;
    bottom:0;
    right:0;
    z-index:9999999;
    text-align:center;
    background-color: #eee;
    opacity: .5

  }
  .loader-container > .v-spinner{
    margin:0 auto;
    position: fixed;
    width: 100%;
    height: 100%;
    top:50%;
  }
   .loader-container > p {
    margin:0 auto;
    position: fixed;
    width: 100%;
    height: 100%;
    top:55%;
   }
</style>
