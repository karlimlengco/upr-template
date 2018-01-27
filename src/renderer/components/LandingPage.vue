<template>
  <div class="container">
    <top-bar></top-bar>
    <side-bar></side-bar>

    <div class="content">
      <div class="content__wrapper">

        <div class="row">
          <div class="five columns">
            <h1>Procurement Status Monitoring</h1>
          </div>

          <div class="seven columns align-right">
            <div style="display: inline-block">
              <input style="width:180px" placeholder="Start Date" v-model="startDate" type="text" format="yyyy-MM-dd" id="start" name="date_from" class="input" onfocus="(this.type='date')">
            </div>

            <div style="display: inline-block">
              <input style="width:180px" placeholder="End Date" v-model="endDate" type="text" format="yyyy-MM-dd" id="end" name="date_to" class="input" onfocus="(this.type='date')">
            </div>
            <button class="button" @click.prevent="search()" id="dateSearch"><span class="nc-icon-mini ui-1_zoom"></span></button>
          </div>
        </div>

        <div  id="programs">
          <button class='button button-unfocus'  v-bind:id="[ isActived == 'bidding' ? 'button-focus' : '']" v-on:click="changeType('bidding')" >Bidding</button>

          <button class='button button-unfocus alternative' v-bind:id="[ isActived  == 'alternative' ? 'button-focus' : '']" v-on:click="changeType('alternative')" >Alternative</button>

          <div class="table-scroll">
           <table class="table table--with-border table-name" v-bind:id="types">
              <thead>
                <tr>
                  <th style="text-align:center">UNITS</th>
                  <th>
                      # UPR
                  </th>
                  <th v-if="showInfo" >Total ABC</th>
                  <th v-if="showInfo" >Approved Contract Amount</th>
                  <th v-if="showInfo" >Residual Amount</th>
                  <th v-if="showInfo" >AVG Days to Complete</th>
                  <th v-if="show" >Number of Days Delay</th>
                  <th style="text-align:center" v-if="show" >Current Status</th>
                  <th style="text-align:center" v-if="show" >Justification</th>
                  <th style="text-align:center" v-if="show" >Action Taken</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(item, index) in programsCenter">
                  <tr>
                    <td>
                      Program {{item.programs}}
                      <button v-if="item.upr_count > 0" v-on:click="clickItemProgram(item)" class="show-child-table"><i class="nc-icon-mini ui-1_circle-add"></i></button>
                    </td>
                    <td>
                      <span tooltip="Total" style="font-weight:bolder; color:#222222" >{{item.upr_count}}</span>
                      <a target="_blank"
                      @click.prevent="openCompleted(item.programs, '', '', types)"
                      tooltip="Completed" class="blue">({{item.completed_count}})</a>
                      <!-- v-bind:href="'/procurements/unit-purchase-requests/overview/ongoing/'+item.programs+'?type='+types" -->
                      <a target="_blank"
                      @click.prevent="openOngoing(item.programs, '', '', types)"
                      tooltip="Ongoing" class="green">({{item.ongoing_count}})</a>
                      <a target="_blank"
                      @click.prevent="openCancelled(item.programs, '', '', types)"
                      tooltip="Cancelled" style="color:#7a7a7a" >({{item.cancelled_count}})</a>
                      <!-- v-bind:href="'/procurements/unit-purchase-requests/overview/cancelled/'+item.programs+'?type='+types"  -->
                      <!-- v-bind:href="'/procurements/unit-purchase-requests/overview/delay/'+item.programs+'?type='+types"  -->
                      <a target="_blank"
                      @click.prevent="openDelay(item.programs, '', '', types)"
                      tooltip="Delay"
                      class="red">({{item.delay_count}})</a>
                    </td>
                    <td v-if="showInfo">{{item.total_abc}}</td>
                    <td v-if="showInfo">{{item.total_bid}}</td>
                    <td v-if="showInfo">{{item.total_residual}}</td>
                    <td v-if="showInfo"></td>
                    <td v-if="show"></td>
                    <td v-if="show"></td>
                    <td v-if="show"></td>
                    <td v-if="show"></td>
                  </tr>

                  <!-- Child PCCO -->
                    <tr>
                      <td class="has-child" colspan="10">
                        <table class="child-table table-name">
                          <tbody>
                            <template v-for="itemProgData in uprCenters.data">
                            <template v-if="uprCenters.program == item.programs">
                              <tr>
                                <td >
                                  <button  v-on:click="clickItemProgramCenter(itemProgData)" class="show-grand-child-table" ><i class="nc-icon-mini ui-1_circle-add"></i></button>
                                  {{itemProgData.name}}
                                </td>
                                <td>
                                  <span tooltip="Total" style="font-weight:bolder; color:#222222" >{{itemProgData.upr_count}}</span>
                                  <a
                                    target="_blank"
                                    @click.prevent="openCompleted(item.programs, itemProgData.name, '', types)"
                                    tooltip="Completed"
                                    class="blue"
                                  >
                                    ({{itemProgData.completed_count}})
                                  </a>
                                    <!-- v-bind:href="'/procurements/unit-purchase-requests/overview/ongoing/'+item.programs+'/'+itemProgData.name+'?type='+types" -->
                                  <a
                                    target="_blank"
                                    @click.prevent="openOngoing(item.programs, itemProgData.name, '', types)"
                                    tooltip="Ongoing"
                                    class="green"
                                  >
                                    ({{itemProgData.ongoing_count}})
                                  </a>
                                    <!-- v-bind:href="'/procurements/unit-purchase-requests/overview/cancelled/'+item.programs+'/'+itemProgData.name+'?type='+types" -->
                                  <a
                                    target="_blank"

                                    @click.prevent="openCancelled(item.programs, itemProgData.name, '', types)"
                                    tooltip="Cancelled"
                                    style="color:#7a7a7a"
                                  >
                                    ({{itemProgData.cancelled_count}})
                                  </a>
                                    <!-- v-bind:href="'/procurements/unit-purchase-requests/overview/delay/'+item.programs+'/'+itemProgData.name+'?type='+types" -->
                                  <a
                                    target="_blank"
                                    @click.prevent="openDelay(item.programs, itemProgData.name, '', types)"
                                    tooltip="Delay"
                                    class="red"
                                  >
                                    ({{itemProgData.delay_count}})
                                  </a>
                                </td>
                                <td v-if="showInfo">{{itemProgData.total_abc}}</td>
                                <td v-if="showInfo">{{itemProgData.total_bid}}</td>
                                <td v-if="showInfo">{{itemProgData.total_residual}}</td>
                                <td v-if="showInfo"></td>

                                <td v-if="show" ></td>
                                <td v-if="show" ></td>
                                <td v-if="show" ></td>
                                <td v-if="show" ></td>
                              </tr>
                              <!-- Grand Child Units -->
                                <tr >
                                  <td class="has-child" colspan="10">
                                    <table class="grand-child-table table-name">
                                      <tbody>
                                      <template v-for="itemUnitData in uprUnits.data">
                                      <template v-if="uprUnits.program == item.programs">
                                      <template v-if="uprUnits.center == itemProgData.name">
                                      <tr>
                                        <td>
                                          {{itemUnitData.short_code}}

                                          <button  v-on:click="clickItemUnit(itemUnitData)" class="show-great-grand-child-table"><i class="nc-icon-mini ui-1_circle-add"></i></button>
                                        </td>
                                        <td>

                                          <span tooltip="Total" style="font-weight:bolder; color:#222222" >{{itemUnitData.upr_count}}</span>

                                          <a
                                            target="_blank"
                                            @click.prevent="openCompleted(item.programs, itemProgData.name, itemUnitData.short_code, types)"
                                            tooltip="Completed"
                                            class="blue"
                                                 >({{itemUnitData.completed_count}}
                                           )</a>

                                          <a
                                            target="_blank"
                                            tooltip="Ongoing"

                                            @click.prevent="openOngoing(item.programs, itemProgData.name, itemUnitData.short_code, types)"
                                            class="green">
                                                ({{itemUnitData.ongoing_count}})
                                          </a>

                                          <!--   v-bind:href="'/procurements/unit-purchase-requests/overview/cancelled/'+item.programs+'/'+itemProgData.name+'/'+ itemUnitData.short_code+'?type='+types"
 -->                                          <a
                                            target="_blank"

                                            @click.prevent="openCancelled(item.programs, itemProgData.name, itemUnitData.short_code, types)"
                                            tooltip="Cancelled"
                                            style="color:#7a7a7a">
                                                ({{itemUnitData.cancelled_count}})
                                          </a>
                                          <!-- v-bind:href="'/procurements/unit-purchase-requests/overview/delay/'+item.programs+'/'+itemProgData.name+'/'+ itemUnitData.short_code+'?type='+types" -->
                                          <a
                                            target="_blank"
                                            @click.prevent="openDelay(item.programs, itemProgData.name, itemUnitData.short_code, types)"
                                            tooltip="Delay"
                                            class="red">
                                                ({{itemUnitData.delay_count}})
                                          </a>

                                        </td>
                                        <td v-if="showInfo" >{{itemUnitData.total_abc}}</td>
                                        <td v-if="showInfo" >{{itemUnitData.total_bid}}</td>
                                        <td v-if="showInfo" >{{itemUnitData.total_residual}}</td>
                                        <td v-if="showInfo" ></td>

                                        <td v-if="show" ></td>
                                        <td v-if="show"   style="text-align:left"></td>
                                        <td v-if="show" ></td>
                                        <td v-if="show" ></td>
                                      </tr>

                                      <!-- Great Grand Child -->
                                        <tr>
                                          <td class="has-child" colspan="10">
                                            <table class="great-grand-child-table table-name">
                                              <tbody>
                                                <template v-for="itemProgCentData in overviewUPR.data">
                                                <template v-if="overviewUPR.program == itemUnitData.name">
                                                <template v-if="overviewUPR.center == itemUnitData.short_code">
                                                  <tr>
                                                    <td> <i class="green" style="font-family: Verdana;">{{itemProgCentData.upr_number}}</i> <small style="display:block"><a target="_blank" @click.prevent="openUPR(itemProgCentData.id)" v-bind:href="'/procurements/unit-purchase-requests/timelines/'+itemProgCentData.id ">({{itemProgCentData.project_name}})</a></small></td>
                                                    <td @click.prevent="changeInfo()">
                                                      <span class="blue" v-if="itemProgCentData.completed_count != 0 && itemProgCentData.completed_count != null">Completed</span>
                                                      <span  class="red" v-if="itemProgCentData.delay_count != 0 && itemProgCentData.status != 'cancelled' ">Delayed</span>
                                                      <span  v-if="itemProgCentData.status == 'cancelled' || itemProgCentData.status =='Cancelled' ">Cancelled</span>
                                                      <span class="green" v-if="itemProgCentData.delay_count == 0 && itemProgCentData.ongoing_count != 0 && itemProgCentData.status != 'cancelled' ">Ongoing</span>

                                                    </td>
                                                    <td v-if="showInfo" >{{itemProgCentData.total_abc}}</td>
                                                    <td v-if="showInfo" >{{itemProgCentData.total_bid}}</td>
                                                    <td v-if="showInfo" >{{itemProgCentData.total_residual}}</td>
                                                    <td v-if="showInfo" >{{itemProgCentData.avg_days}}</td>

                                                    <td v-if="show && itemProgCentData.status != 'completed'  ">
                                                      <span v-if="itemProgCentData.status != 'cancelled' && itemProgCentData.delay_count != 0">{{itemProgCentData.delay}}</span>
                                                    </td>
                                                    <td v-if="itemProgCentData.status == 'completed'  "></td>
                                                    <td v-if="show "  style="text-align:left">{{itemProgCentData.status}}</td>
                                                    <td v-if="show"> <span v-if="itemProgCentData.delay_count != 0 && itemProgCentData.status != 'cancelled' ">{{itemProgCentData.last_remarks}}</span> </td>
                                                    <td v-if="show">
                                                      <span v-if="itemProgCentData.delay_count != 0 && itemProgCentData.status != 'cancelled' ">{{itemProgCentData.last_action}}</span>
                                                    </td>

                                                  </tr>
                                                </template>
                                                </template>
                                                </template>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      <!-- Great Grand Child -->
                                      </template>
                                      </template>
                                      </template>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                              <!-- Grand Child Units -->
                            </template>
                            </template>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  <!-- Child PCCO-->

                </template>

              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import TopBar from './LandingPage/TopBar'
  import SideBar from './LandingPage/SideBar'
  import { mapGetters, mapActions } from 'vuex'
  import axios from 'axios'
  import { API_ROOT } from '../../config.js'
  const moment = require('moment')
  const isOnline = require('is-online');

  var arrayIDs            =   [];
  var arrayProgramCenter  =   [];
  var array2IDs           =   [];

  var tarrayIDs            =   [];
  var tarrayProgramCenter  =   [];
  var tarray2IDs           =   [];

  export default {
    data () {
      return {
        items: [],
        endDate: moment().format('Y-M-D'),
        startDate: "",
        timelineItem: [],
        timelineItemProgram: [],
        timelineitemUnits: [],
        timelineitemProgramCenters:[],
        itemProgram: [],
        itemProgramCenters:[],
        itemUnits:[],
        types:"bidding",
        psrTypes:"psr-bidding",
        show:false,
        showInfo:true,
        show2:true,
        show3:false,
        pageTitle: 'Overview'
      }
    },
    name: 'landing-page',
    components: { TopBar, SideBar},
    methods: {
      ...mapActions([
        'listUsers',
        'syncISPQ',
        'syncNTP',
        'serverNTPPush',
        'syncRFQ',
        'serverRFQPush',
        'serverIAARPush',
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
        'serverPreprocPush',
        'syncITB',
        'serverITBPush',
        'serverDIIRPush',
        'syncBidDocs',
        'serverBidDocsPush',
        'syncSOBE',
        'serverSOBEPush',
        'syncFormHeaders',
        'syncPCCOHeaders',
        'syncPostQual',
        'serverPostQualPush',
        'syncPrebid',
        'serverPrebidPush',
        'syncNOA',
        'syncPermissions',
        'syncDocumentAcceptance',
        'serverDocumentAcceptancePush',
        'syncVoucher',
        'serverVoucherPush',
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
        'serverIAARInvoicePush',
        'serverNODPush',
        'serverNODItemsPush',
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
        'getPrograms',
        'getAlternativePrograms',
        'getPSRUprCenters',
        'getPSRAlternativeUprCenters',
        'getUPRUnits',
        'getOverviewUPRs',
        'getAlternativeOverviewUPRs',
        'getAlternativeUPRUnits',
        'syncBacSec',
        'serverBacSecPush',
        'syncAccounts'
      ]),
      loadData: function () {
        isOnline().then(online => {
          if (online) {
            this.$root.$children[0].loading = true
            axios.get(API_ROOT + 'api/user-lists?token=' + localStorage.getItem('id_token'))
              .then(response => {
                this.items = response.data
                this.syncNewUser(this.items)
                this.$root.$children[0].loading = false
              }).catch(e => {
                console.log(e)
                this.$root.$children[0].loading = false
                this.$root.$children[0].showNotiError = true
                this.$root.$children[0].showNotiErrorMsg = "You are currently Online. enter password to sync"
                this.$root.$children[0].onlinePassword = true
              })
            this.syncModules()

          }
        });
      },
      clickItemProgram: function(item){
        if( arrayIDs.indexOf(item.programs) == -1 )
        {
          arrayIDs.push(item.programs);
          // console.log(arrayIDs)
          this.fetchUPRCenters(item.programs)
        }
      },
      clickItemProgramCenter: function(item){
        if ( arrayProgramCenter.indexOf(item.name) == -1 ) {
          if (arrayProgramCenter[item.name] != item.name) {
            arrayProgramCenter[item.name]    =   item.name;
            this.fetchUnits(item.programs, item.name)
          }
        }
      },
      clickItemUnit: function(item){
        this.show = true;
        if( arrayProgramCenter.indexOf(item.name) == -1 && arrayProgramCenter[item.name] == item.name) {
          if( array2IDs.indexOf(item.short_code) == -1 ) {
            if(array2IDs[item.name] != item.short_code) {
              array2IDs[item.name]    =   item.short_code;
              this.fetchUPRs(item.short_code, item.name)
            }
          }
        }
      },
      openUPR: function(id) {
        this.$router.push({ path: 'upr-view-page', query: { uprId: id }})
      },
        // programs, pcco name, unit code, procurement type
      openDelay: function(programs, name = "", short_code = "", types) {
        this.$router.push({ path: 'upr-delay-list-page', query: { uprProgram: programs, pccoName: name, unitCode: short_code, pType: types }})
      },
      openCancelled: function(programs, name = "", short_code = "", types) {
        this.$router.push({ path: 'upr-cancelled-list-page', query: { uprProgram: programs, pccoName: name, unitCode: short_code, pType: types }})
      },
      openOngoing: function(programs, name = "", short_code = "", types) {
        this.$router.push({ path: 'upr-ongoing-list-page', query: { uprProgram: programs, pccoName: name, unitCode: short_code, pType: types }})
      },
      openCompleted: function(programs, name = "", short_code = "", types) {
        this.$router.push({ path: 'upr-completed-list-page', query: { uprProgram: programs, pccoName: name, unitCode: short_code, pType: types }})
      },
      fetchUPRs: function(short_code, name){
          if (this.types == 'bidding') {
            this.getOverviewUPRs([short_code, name, this.startDate, this.endDate])
          } else {
            this.getAlternativeOverviewUPRs([short_code, name, this.startDate, this.endDate])
          }
      },
      fetchUPRCenters: function(program){
        if (this.types == 'bidding') {
          this.getPSRUprCenters([program, this.startDate, this.endDate])
        } else {
          this.getPSRAlternativeUprCenters([program, this.startDate, this.endDate])
        }
      },
      fetchUnits: function(program, center){
        if (this.types == 'bidding') {
          this.getUPRUnits([center, program, this.startDate, this.endDate])
        } else {
          this.getAlternativeUPRUnits([center, program, this.startDate, this.endDate])
        }
      },
      fetchUprAnalytics: function(type) {
        if (type == 'bidding') {
          this.getPrograms([this.startDate, this.endDate])
        } else {
          this.getAlternativePrograms([this.startDate, this.endDate])
        }
      },
      search: function()
      {
        if (this.types == 'bidding') {
          this.getPrograms([this.startDate, this.endDate])
        } else {
          this.getAlternativePrograms([this.startDate, this.endDate])
        }
      },
      syncNewUser: function (items) {
        this.syncUsers(items)
      },
      syncNewUnit: function () {
        this.syncUnits()
      },
      changeType: function(type){
        this.types = type
        this.itemProgram = []
        this.itemProgramCenters = []
        this.itemUnits = []
        arrayIDs = []
        arrayProgramCenter = []
        array2IDs = []
        $('i').removeClass('ui-1_circle-delete');
        $('.table-name').removeClass('is-visible');
        $('i').addClass('ui-1_circle-add');
        this.show = false;
        this.showInfo = true;
        this.fetchUprAnalytics(type)
      },
      syncModules: function () {


        this.listUsers([])

        this.syncISPQ().then(response => {
        })
        this.syncAccounts().then(response => {
        })

        this.syncDIIR()
        this.syncNTP()
        this.serverNTPPush()
        this.syncSuppliers()
        this.syncNOD()
        this.syncNODItems()
        this.syncIAAR()
        this.syncIAARInvoice()
        this.serverIAARInvoicePush()
        this.syncPreproc()
        this.serverPreprocPush()
        this.syncITB()
        this.serverITBPush()
        this.serverDIIRPush()
        this.syncBidDocs()
        this.serverBidDocsPush()
        this.syncSOBE()
        this.serverSOBEPush()
        this.syncPostQual()
        this.syncFormHeaders()
        this.syncPCCOHeaders()
        this.serverPostQualPush()
        this.syncPrebid()
        this.serverPrebidPush()
        this.syncRFQ()
        this.serverRFQPush()
        this.serverIAARPush()
        this.syncCanvassing()
        this.syncRFQProponent()
        this.serverRFQProponentPush()
        this.syncDocumentAcceptance()
        this.serverDocumentAcceptancePush()
        this.syncPhilgeps()
        this.serverPhilgepsPush()
        this.syncNewUnit()
        this.syncPermissions()
        this.syncDIIRIssue()
        this.syncUserRoles()
        this.syncProcurements()
        this.syncPO()
        this.syncPOItem()
        this.syncNOA()
        this.syncSignatory()
        this.syncRoles()
        this.syncVoucher()
        this.serverVoucherPush()
        this.syncPaymentTerms()
        this.syncChargeabilitys()
        this.syncProcurementTypes()
        this.syncProcurementModes()
        this.serverProcurementTypePush()
        this.serverNODPush()
        this.serverNODItemsPush()
        this.syncUprs()
        this.syncInvitation()
        this.syncUprItems()
        this.serverRolePush()
        this.serverChargeabilityPush()
        this.serverPaymentTermPush()
        this.serverCanvassingPush()
        this.serverNOAPush()
        this.serverPermissionPush()
        this.serverUnitPush()
        this.serverUserPush()
        this.serverProcurementModePush()
        this.serverProcurementPush()
        this.serverSignatoryPush()
        this.serverUprPush()
        this.serverISPQPush()
        this.serverPOPush()
        this.serverPOItemPush()
        this.serverInvitationPush()
        this.serverUprItemPush()
        this.syncBacSec()
        this.serverBacSecPush()
      }
    },
    mounted: function () {

      this.fetchUprAnalytics(this.types);
 
      this.loadData()

    },
    computed: {
      ...mapGetters([
        'users',
        'uprCenters',
        'overviewUPR',
        'uprUnits',
        'programsCenter'
      ]),
      isActived: function () {
          return this.types
      }
    },
    ready: function () {
      // setInterval(function () {
        // this.loadData()
      // }.bind(this), 100000)
    }
  }
</script>

<style>
.table-name {
  width: 100%;
}
.table-name tr th,
.table-name tr td {
  width: 170px !important;
  min-width: 170px !important;
}
.table-name tr th:first-child,
.table-name tr td:first-child {
  width: 300px !important;
  min-width: 300px !important;
}
.table-name tr th.has-child .child-table tr th,
.table-name tr td.has-child .child-table tr th,
.table-name tr th.has-child .grand-child-table tr th,
.table-name tr td.has-child .grand-child-table tr th,
.table-name tr th.has-child .great-grand-child-table tr th,
.table-name tr td.has-child .great-grand-child-table tr th,
.table-name tr th.has-child .child-table tr td,
.table-name tr td.has-child .child-table tr td,
.table-name tr th.has-child .grand-child-table tr td,
.table-name tr td.has-child .grand-child-table tr td,
.table-name tr th.has-child .great-grand-child-table tr td,
.table-name tr td.has-child .great-grand-child-table tr td {
  width: 170px !important;
  min-width: 170px !important;
}
.table-name tr th.has-child .child-table tr th:first-child,
.table-name tr td.has-child .child-table tr th:first-child,
.table-name tr th.has-child .grand-child-table tr th:first-child,
.table-name tr td.has-child .grand-child-table tr th:first-child,
.table-name tr th.has-child .great-grand-child-table tr th:first-child,
.table-name tr td.has-child .great-grand-child-table tr th:first-child,
.table-name tr th.has-child .child-table tr td:first-child,
.table-name tr td.has-child .child-table tr td:first-child,
.table-name tr th.has-child .grand-child-table tr td:first-child,
.table-name tr td.has-child .grand-child-table tr td:first-child,
.table-name tr th.has-child .great-grand-child-table tr td:first-child,
.table-name tr td.has-child .great-grand-child-table tr td:first-child {
  width: 299px !important;
  min-width: 299px !important;
}
</style>