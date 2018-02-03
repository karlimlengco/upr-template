<template>
  <div class="login">


    <div class="left-panel">
      <div class="login-logo">
          <a href=""><img src="static/assets/img/logo.png" alt=""></a>
      </div>
      <h1 class="login-notice-title">AFP</h1>
      <p class="login-notice">Automated Procurement Processing,<br>Monitoring and Information System</p>
    </div>
    <div class="right-panel">
      <connectivity></connectivity>
      <form action="" class="login-form" v-on:submit="manualSync">
        <button class ="button">SYNC</button>
      </form>
      <form action="" class="login-form" v-on:submit="signin">
        <button class ="button">ENTER</button>
      </form>
      <p class="version">Version 1.1.0</p>
    </div>

  </div>
</template>

<script>
  import router from '../router'
  import { db } from '../../server/db.js'
  import { mapGetters, mapActions } from 'vuex'
  import Connectivity from './Connectivity'

  var internetAvailable = require("internet-available");
  const isOnline = require('is-online');

  export default {
    name: 'login-page',
    data () {
      return {
        login: 'kblimlengco',
        password: 'password',
        error: false,
        isExist: '',
        user: {
          authenticated: false,
          profile: null
        }
      }
    },
    components: { Connectivity },
    mounted: function() {
      localStorage.setItem('id_token', null)
      // this.loadData()
    },
    methods: {
      ...mapActions([
        'syncFormHeaders',
        'syncSignatory',
        'syncProcurementModes',
        'syncChargeabilitys',
        'syncPaymentTerms',
        'syncProcurementTypes',
        'syncProcurements',
        'syncSuppliers',
        'syncUnits',
        'syncAccounts'
      ]),
      manualSync(){  
        isOnline().then(online => {
          if (online) {
            this.syncModules()
          }
          else{
            alert('You are currently offline')
          }
        });
      },
      signin (event) {
        router.push({
          name: 'upr-list-page'
        })
      },
      uprList: function () {
        router.push({
          name: 'upr-list-page'
        })
      },
      loadData: function () {
        isOnline().then(online => {
          if (online) {
            this.syncModules()
          }
          else{
            alert('You are currently offline')
          }
        });
      },
      syncModules: function () {
        var e = this
        e.$root.$children[0].loading = true
        internetAvailable({
            timeout: 1000,
            retries: 10,
        }).then(function(){
            e.syncAccounts()
            e.syncSuppliers()
            e.syncFormHeaders()
            e.syncUnits()
            e.syncProcurements()
            e.syncSignatory()
            e.syncPaymentTerms()
            e.syncChargeabilitys()
            e.syncProcurementTypes()
            e.syncProcurementModes()
            setTimeout(function () {
                e.$root.$children[0].loading = false
            }.bind(this), 30000)
        }).catch(function(e){
            e.$root.$children[0].loading = false
        });
        
      }
    }
  }
</script>
