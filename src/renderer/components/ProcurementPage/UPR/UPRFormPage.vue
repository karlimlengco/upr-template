<template>
  <div class="container">
    <top-bar></top-bar>
    <side-bar></side-bar>



    <!-- AccountCode -->
    <div class="modal" id="add-account-code-modal" style="z-index:999999999; left:0; top:0; right:0; bottom:0">
      <div class="modal__dialogue modal__dialogue--round-corner">
        <button type="button" class="modal__close-button">
            <i class="nc-icon-outline ui-1_simple-remove"></i>
        </button>
        <div class="moda__dialogue__head">
            <h1 class="modal__title">Account Code</h1>
        </div>
        <div class="row">
          <div class="twelve columns">
            
            <selecta-remote
              :option="codesList"
              v-model="account_code">
            </selecta-remote>
          </div>
        </div>
        <div class="modal__dialogue__body">
          <input name="_method" type="hidden" value="POST">
        </div>
        <div class="modal__dialogue__foot">
          <button type="button" class="button pull-left" @click.prevent="closeModal">Cancel</button>
          <button class="button" @click.prevent="addCode">Proceed</button>
        </div>
      </div>
    </div>
    <!-- AccountCode -->
    <!-- type -->

    <div class="modal" id="chargeability-modal" style="z-index:999999999; left:0; top:0; right:0; bottom:0">
      <div class="modal__dialogue modal__dialogue--round-corner">
        <button type="button" class="modal__close-button">
            <i class="nc-icon-outline ui-1_simple-remove"></i>
        </button>
        <div class="moda__dialogue__head">
            <h1 class="modal__title">New Chargeability</h1>
        </div>
        <div class="modal__dialogue__body">
          <div class="row">
            <div class="six columns">
                <div class="form-group">
                  <label for="" class="label">Name</label>
                  <input type="text" class="input"  name="name" v-model="chargeModel.name" >
                  <span class="help-text" v-show="errors.has('name')">{{ errors.first('name') }}</span>
                </div>
            </div>
            <div class="six columns">
                <div class="form-group">
                  <label for="" class="label">Description</label>
                  <input type="text" class="input"  name="description" v-model="chargeModel.description" >
                  <span class="help-text" v-show="errors.has('description')">{{ errors.first('description') }}</span>
                </div>
            </div>
          </div>

          <input name="_method" type="hidden" value="POST">
        </div>
        <div class="modal__dialogue__foot">
          <button type="button" class="button pull-left" @click.prevent="closeModal">Cancel</button>
          <button class="button" @click.prevent="saveCharge">Proceed</button>
        </div>
      </div>
    </div>
    <!-- type -->

    <!-- type -->

    <div class="modal" id="new-ptype-modal" style="z-index:999999999; left:0; top:0; right:0; bottom:0">
      <div class="modal__dialogue modal__dialogue--round-corner">
        <button type="button" class="modal__close-button">
            <i class="nc-icon-outline ui-1_simple-remove"></i>
        </button>
        <div class="moda__dialogue__head">
            <h1 class="modal__title">New Procurement Type</h1>
        </div>
        <div class="modal__dialogue__body">
          <div class="row">
            <div class="six columns">
                <div class="form-group">
                  <label for="" class="label">Name</label>
                  <input type="text" class="input"  name="code" v-model="typeModel.code" >
                  <span class="help-text" v-show="errors.has('code')">{{ errors.first('code') }}</span>
                </div>
            </div>
            <div class="six columns">
                <div class="form-group">
                  <label for="" class="label">Description</label>
                  <input type="text" class="input"  name="description" v-model="typeModel.description" >
                  <span class="help-text" v-show="errors.has('description')">{{ errors.first('description') }}</span>
                </div>
            </div>
          </div>

          <input name="_method" type="hidden" value="POST">
        </div>
        <div class="modal__dialogue__foot">
          <button type="button" class="button pull-left" @click.prevent="closeModal">Cancel</button>
          <button class="button" @click.prevent="saveType">Proceed</button>
        </div>
      </div>
    </div>
    <!-- type -->

    <!-- Signatory -->
    <div class="modal" id="new-signatory-modal" style="z-index:999999999; left:0; top:0; right:0; bottom:0">
      <div class="modal__dialogue modal__dialogue--round-corner">
        <button type="button" class="modal__close-button">
            <i class="nc-icon-outline ui-1_simple-remove"></i>
        </button>
        <div class="moda__dialogue__head">
            <h1 class="modal__title">New Signatory</h1>
        </div>
        <div class="row">
          <div class="six columns">
                  <label for="" class="label">Name</label>
            <input type="text" class="input" required name="name" v-model="signatory.name" >
          </div>
          <div class="six columns">

            <label for="" class="label">Ranks</label>
            <input type="text" class="input" required name="ranks" v-model="signatory.ranks" >
          </div>
        </div>
        <div class="row">
          <div class="six columns">
            <label for="" class="label">Branch</label>
            <input type="text" class="input" required name="branch" v-model="signatory.branch" >
          </div>
          <div class="six columns">
            <label for="" class="label">Designation</label>
            <input type="text" class="input" required name="designation" v-model="signatory.designation" >
          </div>
        </div>
        <div class="modal__dialogue__body">
          <input name="_method" type="hidden" value="POST">
        </div>
        <div class="modal__dialogue__foot">
          <button type="button" class="button pull-left" @click.prevent="closeModal">Cancel</button>
          <button class="button" @click.prevent="addSignatory">Proceed</button>
        </div>
      </div>
    </div>
    <!-- Signatory -->

    <div class="content">
      <div class="content__wrapper">
        <form class="ui form addcatform" @submit.prevent="addUpr">
          <div class="row">
            <div class="twelve columns align-left utility utility--align-right">
              <router-link to="upr-list-page" class="button button--pull-left" ><i class="nc-icon-mini  arrows-1_tail-left"></i></router-link> 
              <button type="submit" class="button" tooltip="Save"><i class="nc-icon-mini ui-2_disk"></i></button>
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
                  <!-- <input type="text" class="input" v-validate="'required'" name="date_prepared" v-model="model.date_prepared" > -->

                  <datepicker  class="input" v-validate="'required'" name="date_prepared" v-model="model.date_prepared"></datepicker>
                  <span class="help-text" v-show="errors.has('date_prepared')">{{ errors.first('date_prepared') }}</span>
                </div>
            </div>
          </div>

          <div class="row">
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
                  <selectize name="other_infos" v-model="model.other_infos" :settings="createSettings" >
                    <option value=''>Select/Add One</option>
                    <option v-for="option in infos" v-bind:value="option.other_infos">
                     {{ option.other_infos }}
                    </option>
                  </selectize>
                  <span class="help-text" v-show="errors.has('other_infos')">{{ errors.first('other_infos') }}</span>
                </div>
            </div>
          </div>

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

          <button v-if="account_code != null"  type="button" @click.prevent="fileInputOpen" class="button pull-right" tooltip="Import"><i class="nc-icon-mini arrows-1_cloud-upload-96"></i></button>
          <input type="file" id="file" style="visibility:hidden" ref="myFiles" class="custom-file-input" @change="previewFiles">

          <div class="row">
            <div class="twelve columns">
              <table class='table' id="item_table">
                <thead>
                  <tr>
                    <th width="45%">Description</th>
                    <th width="10%">Qty</th>
                    <th width="10%">Unit</th>
                    <th width="15%">Unit Price</th>
                    <th width="15%">Amount</th>
                    <th width="5%"></th>
                  </tr>
                </thead>
                <tbody>
                  <template  v-for="(codes, index) in accounts">
                    <tr>
                      <td class="row align-left" colspan="6" style="padding-bottom:0; margin-bottom:0">
                        <h5 class="align-left">{{codes.code}} <a href="#" @click.prevent="removeCode(index)">remove</a></h5>
                      </td>
                    </tr>
                    <template  v-for="(items, index) in itemModel">
                      <tr  v-if="codes.id == items.new_account_code">

                        <td class="row">
                          <input type="text"
                            placeholder="Item Description"
                            class="input"
                            v-validate="'required'"
                            v-model="items.item_description">
                        </td>
                          <input type="text"
                            class="input"
                            style="display:none"
                            readOnly
                            v-validate="'required'"
                            v-model="items.new_account_code">
                        <td class="row">
                         <!--  <input type="text"
                            class="input qty"
                            placeholder="QTY"
                            v-validate="'required'"
                            v-model="items.quantity">
                             -->
                            <vue-numeric 
                              separator="," 
                              v-model="items.quantity" 
                              :precision="2" 
                              class="input">
                                
                              </vue-numeric>
                        </td>
                        <td class="row">
                          <input type="text"
                            class="input"
                            placeholder="Unit"
                            v-validate="'required'"
                            v-model="items.unit_measurement">
                        </td>
                        <td class="row">
<!--                           <input type="text"
                            class="input price"
                            placeholder="Price"
                            v-validate="'required'"
                            v-model="items.unit_price">
 -->
                        <vue-numeric 
                          separator="," 
                          v-model="items.unit_price" 
                          :precision="2" 
                          class="input">
                            
                          </vue-numeric>

                        </td>
                        <td class="row">
                          <input type="text"
                            class="input total_amount"
                            placeholder="Total"
                            v-validate="'required'"
                            :value="total"
                            v-model="items.total_amount">
                        </td>
                        <td>
                          <button
                            @click.stop.prevent="deleteItem(index)"
                            class="button">
                            <i class="nc-icon-outline ui-1_simple-remove"></i>
                          </button>
                        </td>
                      </tr>
                    </template>
                  </template>

                </tbody>
              </table>
            </div>
          </div>

          <div class="row">
            <button @click.prevent="addAccount" id="account_code" class="button">Account Code</button>
            <button v-if="account_code != null" class="button" @click.prevent="addItem">Add Item</button>
          </div>


        </form>

      </div>
    </div>

  </div>
</template>

<script>
  import auth from '../../../api/auth.js'
  import TopBar from '../../LandingPage/TopBar'
  import SideBar from '../../LandingPage/SideBar'
  import { mapGetters, mapActions } from 'vuex'
  import Selectize from 'vue2-selectize'
  import { db } from '../../../../server/db.js'
  import SelectaRemote from '../../Selecta/custom/SelectaAccountCodeTagging'

  import datepicker from 'vue-date'
  import VueNumeric from 'vue-numeric'
  const isOnline = require('is-online');
  const uuidv1 = require('uuid/v1')
  const moment = require('moment')
  import XLSX from 'xlsx';
  const _XLSX = require('xlsx');
  const X = typeof XLSX !== 'undefined' ? XLSX : _XLSX;
  const make_cols = refstr => Array(X.utils.decode_range(refstr).e.c + 1).fill(0).map((x,i) => ({name:X.utils.encode_col(i), key:i}));

  export default {
    name: 'upr-form-page',
    props: {
      codes: null
    },
    components: { SelectaRemote, VueNumeric, TopBar, SideBar, Selectize, datepicker },
    watch:{
      'model.procurement_office' (o) {
        // console.log(o)
        this.listUnitsByPcco(o)    
        // console.log(this.units)    
      }
    },
    methods: {
      ...mapActions([
        'createUpr',
        'createUprItem',
        'dropdownProcurements',
        'dropdownAccounts',
        'dropAccounts',
        'createSignatory',
        'dropdownUnits',
        'dropdownProcurementTypes',
        'serverSignatoryPush',
        'dropdownProcurementModes',
        'dropdownChargeabilitys',
        'getDistinctPlace',
        'dropdownPaymentTerms',
        'getAccountById',
        'dropdownSignatory',
        'createProcurementType',
        'createChargeability',
        'listUnitsByPcco',
        'getDistinctInfo',
        'getDistinctFund',
        'getDistinctPurpose'
      ]),
      previewFiles() {
        this.files = this.$refs.myFiles.files
        var file = this.files[0]
        const reader = new FileReader();
        reader.onload = (e) => {
          /* Parse data */
          const bstr = e.target.result;
          const wb = X.read(bstr, {type:'binary'});
          /* Get first worksheet */
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          /* Convert array of arrays */
          const data = X.utils.sheet_to_json(ws, {header:1});
          /* Update state */
          this.data = data;
          for (var i = 0; i < this.data.length; i++) {
            console.log(this.data)
            if(i != 0)
            {
              this.itemModel.push({
                id: uuidv1(),
                upr_id: this.id,
                item_description: this.data[i][0],
                new_account_code: this.account_code,
                quantity: this.data[i][1],
                unit_measurement: this.data[i][2],
                unit_price: this.data[i][3],
                total_amount: this.data[i][4]
              })

            }
          }
        };
        reader.readAsBinaryString(file)
      },
      fileInputOpen (){
        $("#file").click()
      },
      addUpr () {
        this.$validator.validateAll()
        this.model.id = this.id
        this.model.total_amount = this.total_amount

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

        if (!this.errors.any() ) {
          this.createUpr(this.model)
          this.createUprItem([this.itemModel, this.model.id])
          this.$root.$children[0].showNoti = true
          this.$router.push({  path: 'upr-view-page', query: { uprId: this.model.id, codes: this.accountCodes  } })
        } else {
          this.$root.$children[0].showNotiError = true
          console.log(this.errors)
        }
      },
      addAccount () {
        $('#add-account-code-modal').addClass('is-visible')
      },
      closeModal () {
        $('#add-account-code-modal').removeClass('is-visible')
        $('#new-signatory-modal').removeClass('is-visible')
      },
      addItem () {
        this.itemModel.push({
          id: uuidv1(),
          upr_id: this.id,
          item_description: null,
          new_account_code: this.account_code,
          quantity: 0,
          unit_measurement: null,
          unit_price: 0,
          total_amount: null
        })
      },
      addSignatory () {
        this.signatory.id = uuidv1()
        this.createSignatory(this.signatory)
        this.signatory.created_at = moment().format('Y-MM-DD H:mm:ss')
        this.serverSignatoryPush()
        $('#new-signatory-modal').removeClass('is-visible')

        this.signatory.id = null
        this.signatory.name = null
        this.signatory.ranks = null
        this.signatory.branch = null
        this.signatory.designation = null
      },
      removeCode(index){
        this.accounts.pop(index);
        this.account_codeId = null;
      },
      addCode () {
        // var code = $('#accountCode').text()
        var code = ""
        var str = this.account_code
        var newCode = str.replace("old-", "");
        var newCode = newCode.replace("title-", "");
        var accounts= this.accounts
        this.account_code = newCode

        db.serialize(function () {
          db.get('select * from account_codes WHERE id = ?', newCode, function (err, allRows) {
            if (err != null) {
              console.log(err)
            }
            var code = ""
            if(allRows.old_account_code != "" && allRows.old_account_code != null && allRows.old_account_code != 'undefined') {
              var code = code + "["+allRows.old_account_code+"]"
            }
            var code =  code + " " +allRows.new_account_code+ " " + allRows.name


            accounts.push({
              code: code,
              id: newCode
            })
          })
        })
        this.accounts = accounts 
        $('#add-account-code-modal').removeClass('is-visible') 

      },
      deleteItem (index) {
        this.active = null
        this.itemModel.splice(index, 1)
      },
      saveType () {
        this.typeModel.id = uuidv1()
        this.createProcurementType(this.typeModel)


        this.$root.$children[0].showNoti = true

        $('#new-ptype-modal').removeClass('is-visible')
      },
      saveCharge () {
        this.chargeModel.id = uuidv1()
        this.createChargeability(this.chargeModel)

        this.$root.$children[0].showNoti = true

        $('#chargeability-modal').removeClass('is-visible')
      }
    },
    mounted: function () {
      if (this.$route.query.codes[0].id == undefined) {
        this.$router.push({ path: 'upr-list-page'})
      }

      // isOnline().then(online => {
      //   if (online) {
      //     this.$parent.netStatus = "Online"
      //   } else {
      //     this.$parent.netStatus = "Offline"
      //   }
      // });
      
      this.id = uuidv1()
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
      this.dropdownAccounts()
      this.dropAccounts()
    },
    data () {
      return {
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
        accounts: [],
        itemModel: [],
        account_code: null,
        code: null,
        offset: 4,
        id: -1,
        signatory: {
          id: null,
          name: '',
          ranks: '',
          branch: '',
          designation: '',
          is_sync : null,
          created_at: moment().format('Y-MM-DD H:mm:ss')
        },
        chargeModel: {
          id : null,
          name : null,
          description : null,
          is_sync : null,
          created_at: moment().format("Y-MM-DD H:mm:ss")
        },
        typeModel: {
          id : null,
          code : null,
          description : null,
          is_sync : null,
          created_at: moment().format("Y-MM-DD H:mm:ss")
        },
        model: {
          id: this.id,
          procurement_office: '',
          units: '',
          project_name: '',
          upr_number: '',
          place_of_delivery: '',
          date_prepared: moment().format('Y-M-D'),
          procurement_type: '',
          mode_of_procurement: '',
          chargeability: '',
          fund_validity: '',
          terms_of_payment: '',
          purpose: '',
          requestor_id: '',
          fund_signatory_id: '',
          approver_id: '',
          other_infos: '',
          status: 'draft',
          state: 'draft',
          prepared_by: localStorage.getItem('user_id'),
          total_amount: 0,
          created_at: moment().format("Y-MM-DD H:mm:ss")
        },
        pageTitle: 'Unit Purchase Request'
      }
    },
    computed: {
      ...mapGetters([
        'uprs',
        'codeInfo',
        'places',
        'signatories',
        'procurementCenters',
        'paymentTerms',
        'procurementTypes',
        'funds',
        'units',
        'procurementModes',
        'chargeabilities',
        'codesList',
        'purpose',
        'infos',
        'accountCodes'
      ]),
      total: function () {
        return this.itemModel.reduce(function (prev, product) {
          var unit_price = product.unit_price
          // if(unit_price != null)
          // {
          //   unit_price = unit_price.replace(/,/g, "");
          // }
          product.total_amount = product.quantity * unit_price
          return product.quantity * unit_price
        }, 0)
      },
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
      },
      total_amount: function () {
        let total = []
        Object.entries(this.itemModel).forEach(([key, val]) => {
          total.push(val.total_amount) // the value of the current key.
        })
        console.log(total)
        // return total
        return total.reduce(function (total, num) { return total + num }, 0)
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