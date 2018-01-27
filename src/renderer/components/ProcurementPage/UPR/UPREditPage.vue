<template>
  <div class="container">
    <top-bar></top-bar>
    <side-bar></side-bar>

    <div class="modal" id="delete-modal" style="z-index:999999999; left:0; top:0; right:0; bottom:0">
      <div class="modal__dialogue modal__dialogue--round-corner">
        <button type="button" class="modal__close-button">
            <i class="nc-icon-outline ui-1_simple-remove"></i>
        </button>
        <div class="moda__dialogue__head">
            <h1 class="modal__title">Delete Confirmation</h1>
        </div>
        <div class="row">
          <div class="twelve columns">
            
          </div>
        </div>
        <div class="modal__dialogue__body">
          <input name="_method" type="hidden" value="POST">
        </div>
        <div class="modal__dialogue__foot">
          <button class="button" @click.prevent="deleteUprs()">Proceed</button>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="content__wrapper">
        <form class="ui form addcatform" @submit.prevent="submitForm">
          <div class="row">
            <div class="twelve columns align-left utility utility--align-right">
              <router-link :to="{ path: 'upr-view-page', query: { uprId: uprs.id, codes: accountCodes  }}" class="button button--pull-left" ><i class="nc-icon-mini  arrows-1_tail-left"></i></router-link>
              <button type="submit" class="button" tooltip="Save"><i class="nc-icon-mini ui-2_disk"></i></button>
              <button @click.prevent="deleteModal()" class="button" tooltip="Delete">X</button>
            </div>
          </div>

          <div class="row">
            <div class="four columns">
                <div class="form-group">
                  <label for="" class="label">PC/CO</label>
                  <selectize v-validate="'required'" name="procurement_office" v-model="model.procurement_office">
                    <option value=''>Select One</option>
                    <option v-for="center in procurementCenters" v-bind:value="center.id">
                      {{ center.name }}
                    </option>
                  </selectize>
                  <span class="help-text" v-show="errors.has('procurement_office')">{{ errors.first('procurement_office') }}</span>
                </div>
            </div>
            <div class="four columns">
                <div class="form-group">
                  <label for="" class="label">Catered Unit</label>
                  <selectize v-validate="'required'" name="units" v-model="model.units" >
                    <option value=''>Select One</option>
                    <option v-for="unit in units" v-bind:value="unit.id">
                      {{ unit.short_code }}
                    </option>
                  </selectize>
                  <span class="help-text" v-show="errors.has('units')">{{ errors.first('units') }}</span>
                </div>
            </div>
            <div class="four columns">
                <div class="form-group">
                  <label for="" class="label">Project Name</label>
                  <input type="text" class="input" v-validate="'required'" name="project_name" v-model="model.project_name" >
                  <span class="help-text" v-show="errors.has('project_name')">{{ errors.first('project_name') }}</span>
                </div>
            </div>
          </div>

          <div class="row">
            <div class="four columns">
                <div class="form-group">
                  <label for="" class="label">UPR Number</label>
                  <input type="text" class="input" v-validate="'required'" name="upr_number" v-model="model.upr_number" >
                  <span class="help-text" v-show="errors.has('upr_number')">{{ errors.first('upr_number') }}</span>
                </div>
            </div>
            <div class="four columns">
                <div class="form-group">
                  <label for="" class="label">Place Of Delivery</label>

                  <selectize v-validate="'required'" id="accountCode" name="place_of_delivery" v-model="model.place_of_delivery" :settings="createSettings" >
                    <option value=''>Select/Add One</option>
                    <option v-for="option in places" v-bind:value="option.place_of_delivery">
                     {{ option.place_of_delivery }}
                    </option>
                  </selectize>
                  <span class="help-text" v-show="errors.has('place_of_delivery')">{{ errors.first('place_of_delivery') }}</span>
                </div>
            </div>
            <div class="four columns">
                <div class="form-group">
                  <label for="" class="label">Date Prepared</label>
                  <datepicker  class="input" v-validate="'required'" name="date_prepared" v-model="model.date_prepared"></datepicker>
                  <span class="help-text" v-show="errors.has('date_prepared')">{{ errors.first('date_prepared') }}</span>
                </div>
            </div>
          </div><div class="row">
            <div class="four columns">
                <div class="form-group">
                  <label for="" class="label">Procurement Program/Project</label>
                  <selectize v-validate="'required'" name="procurement_type" v-model="model.procurement_type" :settings="pTypeSettings">
                    <option value=''>Select One</option>
                    <option v-for="type in procurementTypes" v-bind:value="type.id">
                      {{ type.code }}
                    </option>
                  </selectize>
                  <span class="help-text" v-show="errors.has('procurement_type')">{{ errors.first('procurement_type') }}</span>
                </div>
            </div>
            <div class="four columns">
                <div class="form-group">
                  <label for="" class="label">Mode of Procurement</label>
                  <selectize v-validate="'required'" name="mode_of_procurement" v-model="model.mode_of_procurement">
                    <option value=''>Select One</option>
                    <option value='public_bidding'>Public Bidding</option>
                    <option v-for="mode in procurementModes" v-bind:value="mode.id">
                      {{ mode.name }}
                    </option>
                  </selectize>
                  <span class="help-text" v-show="errors.has('mode_of_procurement')">{{ errors.first('mode_of_procurement') }}</span>
                </div>
            </div>
            <div class="four columns">
                <div class="form-group">
                  <label for="" class="label">Chargeability</label>
                  <selectize v-validate="'required'" name="chargeability" v-model="model.chargeability" :settings="chargeSettings">
                    <option value=''>Select One</option>
                    <option v-for="charge in chargeabilities" v-bind:value="charge.id">
                      {{ charge.name }}
                    </option>
                  </selectize>
                  <span class="help-text" v-show="errors.has('chargeability')">{{ errors.first('chargeability') }}</span>
                </div>
            </div>
          </div>

          <div class="row">
            <div class="six columns">
                <div class="form-group">
                  <label for="" class="label">Fund Validity</label>
                  <selectize v-validate="'required'"  name="fund_validity" v-model="model.fund_validity" :settings="createSettings" >
                    <option value=''>Select/Add One</option>
                    <option v-for="option in funds" v-bind:value="option.fund_validity">
                     {{ option.fund_validity }}
                    </option>
                  </selectize>
                  <span class="help-text" v-show="errors.has('fund_validity')">{{ errors.first('fund_validity') }}</span>
                </div>
            </div>
            <div class="six columns">
                <div class="form-group">
                  <label for="" class="label">Terms of Payment</label>
                  <selectize v-validate="'required'" name="terms_of_payment" v-model="model.terms_of_payment">
                    <option value=''>Select One</option>
                    <option v-for="term in paymentTerms" v-bind:value="term.id">
                      {{ term.name }}
                    </option>
                  </selectize>
                  <span class="help-text" v-show="errors.has('terms_of_payment')">{{ errors.first('terms_of_payment') }}</span>
                </div>
            </div>
          </div>

          <div class="row">
            <div class="six columns">
                <div class="form-group">
                  <label for="" class="label">Purpose of Purchase</label>
                  <selectize v-validate="'required'"  name="purpose" v-model="model.purpose" :settings="createSettings" >
                    <option value=''>Select/Add One</option>
                    <option v-for="option in purpose" v-bind:value="option.purpose">
                     {{ option.purpose }}
                    </option>
                  </selectize>
                  <span class="help-text" v-show="errors.has('purpose')">{{ errors.first('purpose') }}</span>
                </div>
            </div>
            <div class="six columns">
                <div class="form-group">
                  <label for="" class="label">Other Essential Info</label>
                  <selectize  name="other_infos" v-model="model.other_infos" :settings="createSettings" >
                    <option value=''>Select/Add One</option>
                    <option v-for="option in infos" v-bind:value="option.other_infos">
                     {{ option.other_infos }}
                    </option>
                  </selectize>
                  <span class="help-text" v-show="errors.has('other_infos')">{{ errors.first('other_infos') }}</span>
                </div>
            </div>
          </div>

          <h3>Signatories</h3>

          <div class="row">
            <div class="four columns">
                <div class="form-group">
                  <label for="" class="label">Requested By</label>
                  <selectize v-validate="'required'" name="requestor_id" v-model="model.requestor_id" :settings="settings">
                    <option value=''>Select One</option>
                    <option v-for="option in signatories" v-bind:value="option.id">
                      {{ option.name }}
                    </option>
                  </selectize>
                  <span class="help-text" v-show="errors.has('requestor_id')">{{ errors.first('requestor_id') }}</span>
                </div>
            </div>
            <div class="four columns">
                <div class="form-group">
                  <label for="" class="label">Fund Certified Available</label>
                  <selectize v-validate="'required'" name="fund_signatory_id" v-model="model.fund_signatory_id" :settings="settings">
                    <option value=''>Select One</option>
                    <option v-for="option in signatories" v-bind:value="option.id">
                      {{ option.name }}
                    </option>
                  </selectize>
                  <span class="help-text" v-show="errors.has('fund_signatory_id')">{{ errors.first('fund_signatory_id') }}</span>
                </div>
            </div>
            <div class="four columns">
                <div class="form-group">
                  <label for="" class="label">Approved By</label>
                  <selectize v-validate="'required'" name="approver_id" v-model="model.approver_id" :settings="settings">
                    <option value=''>Select One</option>
                    <option v-for="option in signatories" v-bind:value="option.id">
                      {{ option.name }}
                    </option>
                  </selectize>
                  <span class="help-text" v-show="errors.has('approver_id')">{{ errors.first('approver_id') }}</span>
                </div>
            </div>
          </div>

        </form>

      </div>
    </div>

  </div>
</template>

<script>
  import TopBar from '../../LandingPage/TopBar'
  import SideBar from '../../LandingPage/SideBar'
  import { mapGetters, mapActions } from 'vuex'
  import datepicker from 'vue-date'
  import Selectize from 'vue2-selectize'
  const uuidv1 = require('uuid/v1')
  const moment = require('moment')

  export default {
    name: 'upr-edit-page',
    components: { TopBar, SideBar, Selectize, datepicker},
    watch:{
      'model.procurement_office' (o) {
        // console.log(o)
        this.listUnitsByPcco(o)    
        // console.log(this.units)    
      }
    },
    methods: {
      ...mapActions([
        'getUpr',
        'updateUpr',
        'createUpr',
        'listUnitsByPcco',
        'dropdownAccounts',
        'createUprItem',
        'deleteUpr',
        'dropdownProcurements',
        'createSignatory',
        'dropdownUnits',
        'dropdownProcurementTypes',
        'dropdownProcurementModes',
        'dropdownChargeabilitys',
        'getDistinctPlace',
        'dropdownPaymentTerms',
        'dropdownSignatory',
        'createProcurementType',
        'createChargeability',
        'getDistinctInfo',
        'getDistinctFund',
        'getDistinctPurpose'
      ]),
      deleteUprs(){
        this.deleteUpr(this.$route.query.uprId).then(response => {
          this.$root.$children[0].showNoti = true
          $('#delete-modal').removeClass('is-visible')
          this.$router.push({ path: 'upr-list-page'})
        })
      },
      deleteModal(){
        $('#delete-modal').addClass('is-visible')
      },
      submitForm () {
        this.$validator.validateAll()

        if (!this.errors.any()) {

          var requestor_text = ""
          var fund_signatory_text = ""
          var approver_text = ""

          for(var key in this.signatories) {
            if(this.signatories[key].id === this.model.requestor_id) {
              requestor_text = this.signatories[key].name +'/'+ this.signatories[key].ranks +'/'+ this.signatories[key].branch +'/'+ this.signatories[key].designation
            }
            if(this.signatories[key].id === this.model.fund_signatory_id) {
              fund_signatory_text = this.signatories[key].name +'/'+ this.signatories[key].ranks +'/'+ this.signatories[key].branch +'/'+ this.signatories[key].designation
            }
            if(this.signatories[key].id === this.model.approver_id) {
              approver_text = this.signatories[key].name +'/'+ this.signatories[key].ranks +'/'+ this.signatories[key].branch +'/'+ this.signatories[key].designation
            }
          }
          this.model.requestor_text = requestor_text
          this.model.fund_signatory_text = fund_signatory_text
          this.model.approver_text = approver_text

          this.model.is_sync = null
          this.model.updated_at = moment().format("Y-MM-DD H:mm:ss")

          this.$delete(this.model, 'total_upr');
          this.$delete(this.model, 'centers');
          this.$delete(this.model, 'unit_code');
          this.$delete(this.model, 'type');
          this.$delete(this.model, 'modes');
          this.$delete(this.model, 'terms');
          this.$delete(this.model, 'charge');

          this.updateUpr([this.uprs.id, this.model]).then(response => {
            this.$root.$children[0].showNoti = true
            this.$router.push({ path: 'upr-view-page', query: { uprId: this.uprs.id }})
          })

        }
        else
        {
          this.$root.$children[0].showNotiError = true
        }
      }
    },
    created (){
        this.model = Object.assign({}, this.$route.query.uprDetails);
    },
    mounted: function () {
      this.dropdownAccounts()
      if (this.$route.query.uprDetails.id == undefined) {
        this.$router.push({ path: 'upr-view-page', query: { uprId: this.$route.query.uprId}})
      }
      this.id = uuidv1()
      this.getUpr(this.$route.query.uprId)
      this.dropdownSignatory()
      this.dropdownProcurements()
      this.dropdownProcurementModes()
      this.dropdownChargeabilitys()
      this.dropdownProcurementTypes()
      this.getDistinctPlace()
      this.dropdownPaymentTerms()
      // this.dropdownUnits()
      this.getDistinctPurpose()
      this.getDistinctInfo()
      this.getDistinctFund()
    },
    data () {
      return {
        offset: 4,
        model: {
          project_name: null,
          upr_number: null,
          place_of_delivery: null,
          date_prepared: null,
          units: null,
          procurement_type: null,
          procurement_office: null,
          chargeability: null,
          fund_validity: null,
          other_infos: null,
          purpose: null,
          requestor_id: null,
          approver_id: null,
          fund_signatory_id: null,
          terms_of_payment: null,
          mode_of_procurement: null,
          is_sync:null,
          updated_at: moment().format("Y-MM-DD H:mm:ss")
        },
        settings: {
          create: true,
          create:function (input){
            $('#new-signatory-modal').addClass('is-visible')
            return true
          }
        },
        pTypeSettings: {
          create: true,
          create:function (input){
            $('#new-ptype-modal').addClass('is-visible')
            return true
          }
        },
        chargeSettings: {
          create: true,
          create:function (input){
            $('#chargeability-modal').addClass('is-visible')
            return true
          }
        },
        createSettings: {
          create: true,
          create:function (input){
            return { value:input, text:input};
          }
        },
        pageTitle: 'Unit Purchase Request'
      }
    },
    computed: {
      ...mapGetters([
        'uprs',
        'places',
        'accountCodes',
        'signatories',
        'procurementCenters',
        'paymentTerms',
        'procurementTypes',
        'funds',
        'units',
        'procurementModes',
        'chargeabilities',
        'purpose',
        'infos',
      ]),
      accountSettings: function () {
        return {
          options: this.$route.query.codes,
          optgroups: [
            {id: 'nac', name: 'New Account'},
            {id: 'oac', name: 'Old Account'},
            {id: 'title', name: 'Title'}
          ],
          labelField: 'model',
          valueField: 'id',
          optgroupField: 'make',
          optgroupLabelField: 'name',
          optgroupValueField: 'id',
          optgroupOrder: ['title', 'nac', 'oac'],
          searchField: ['model'],
          plugins: ['optgroup_columns']
        }
      }
    }
  }
</script>
<style>
  .input-wrapper{
      border: 1px solid transparent!important;
      border-radius: 0px!important;
      vertical-align: middle;
      display: flex;
      justify-content: space-between;
      flex-flow: row nowrap;
      align-items: center;
      padding: 0 15px 0 0!important;
      height:44px!important;
      box-sizing: border-box;
  }
  .input-wrapper .input{
    border: none!important;
  }
</style>