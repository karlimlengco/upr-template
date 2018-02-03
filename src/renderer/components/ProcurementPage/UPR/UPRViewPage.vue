<template>
  <div class="container">
    <top-bar></top-bar>
    <side-bar></side-bar>
    <!-- Import -->
    <div class="modal" id="import-items-modal" style="z-index:999999999; left:0; top:0; right:0; bottom:0">
      <div class="modal__dialogue modal__dialogue--round-corner">
        <button type="button" class="modal__close-button">
            <i class="nc-icon-outline ui-1_simple-remove"></i>
        </button>
        <div class="moda__dialogue__head">
            <h1 class="modal__title">Import Items</h1>
        </div>
        <div class="row">
          <div class="twelve columns">
            <selecta-remote
              :option="codesList"
              v-model="account_code">
            </selecta-remote>
          </div>
          <input type="file" id="file" v-if="account_code"  ref="myFiles" class="custom-file-input" @change="previewFiles">


        </div>
        <div class="modal__dialogue__body">
          <input name="_method" type="hidden" value="POST">
        </div>
        <div class="modal__dialogue__foot">
        </div>
      </div>
    </div>
    <!-- AccountCode -->
    <!-- AccountCode -->
    <div class="modal" id="add-account-code-modal" style="z-index:999999999; left:0; top:0; right:0; bottom:0">
      <div class="modal__dialogue modal__dialogue--round-corner">
        <button type="button" class="modal__close-button">
            <i class="nc-icon-outline ui-1_simple-remove"></i>
        </button>
        <div class="moda__dialogue__head">
            <h1 class="modal__title">Add Item</h1>
        </div>
        <div class="row">
          <div class="twelve columns">
     <!--        <selectize id="accountCode" name="new_account_code" v-model="modelItems.new_account_code" :settings="accountSettings" >
              <option value=''>Select One</option>
            </selectize> -->
            <selecta-remote
              :option="codesList"
              v-model="modelItems.new_account_code">
            </selecta-remote>
          </div>

          <div class="twelve columns">
            <label for="" class="label">Description</label>
            <input type="text" class="input" required name="item_description" v-model="modelItems.item_description" >
          </div>

          <div class="twelve columns">
            <label for="" class="label">Quantity</label>

            <vue-numeric separator="," v-model="modelItems.quantity" :precision="2" class="input"></vue-numeric>

            <!-- <input type="text" class="input" required name="quantity" v-model="modelItems.quantity" > -->
          </div>

          <div class="twelve columns">
            <label for="" class="label">Unit of measurement</label>
            <input type="text" class="input" required name="unit_measurement" v-model="modelItems.unit_measurement" >
          </div>

          <div class="twelve columns">
            <label for="" class="label">Unit Price</label>
            <!-- <input type="text" class="input" v-on:keyup="keymonitor" required name="unit_price" v-model="modelItems.unit_price" > -->

            <vue-numeric separator="," v-model="modelItems.unit_price" :precision="2" class="input"></vue-numeric>

          </div>

          <div class="twelve columns">
            <label for="" class="label">Total Amount</label>
            <input type="text" class="input" readonly required name="total_amount" :value="total">
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

    <!-- AccountCode -->
    <div class="modal" id="edit-account-code-modal" style="z-index:999999999; left:0; top:0; right:0; bottom:0">
      <div class="modal__dialogue modal__dialogue--round-corner">
        <button type="button" class="modal__close-button">
            <i class="nc-icon-outline ui-1_simple-remove"></i>
        </button>
        <div class="moda__dialogue__head">
            <h1 class="modal__title">Edit Item</h1>
        </div>
        <div class="row">
          <div class="twelve columns">
           <!--  <selectize id="accountCode" name="new_account_code" v-model="modelItems.new_account_code" :settings="accountSettings" >
              <option value=''>Select One</option>
            </selectize> -->

            <selecta-remote
              :option="codesList"
              v-model="modelItems.new_account_code">
            </selecta-remote>
          </div>

          <div class="twelve columns">
            <label for="" class="label">Description</label>
            <input type="text" class="input" required name="item_description" v-model="modelItems.item_description" >
          </div>

          <div class="twelve columns">
            <label for="" class="label">Quantity</label>
            <vue-numeric separator="," v-model="modelItems.quantity" :precision="2" class="input"></vue-numeric>
            <!-- <input type="text" class="input" required name="quantity" v-model="modelItems.quantity" > -->
          </div>

          <div class="twelve columns">
            <label for="" class="label">Unit of measurement</label>
            <input type="text" class="input" required name="unit_measurement" v-model="modelItems.unit_measurement" >
          </div>

          <div class="twelve columns">
            <label for="" class="label">Unit Price</label>
            <!-- <input type="text" class="input" required name="unit_price" v-model="modelItems.unit_price" v-on:keyup="keymonitor" > -->
            <vue-numeric separator="," v-model="modelItems.unit_price" :precision="2" class="input"></vue-numeric>

          </div>

          <div class="twelve columns">
            <label for="" class="label">Total Amount</label>
            <input type="text" class="input" readonly required name="total_amount" :value="total">
          </div>

        </div>
        <div class="modal__dialogue__body">
          <input name="_method" type="hidden" value="POST">
        </div>
        <div class="modal__dialogue__foot">
          <button type="button" class="button pull-left" @click.prevent="closeModal">Cancel</button>
          <button class="button" @click.prevent="updateItem">Proceed</button>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="content__wrapper">
        <div class="row">
          <div class="twelve columns align-right utility utility--align-right"> 
            <a
              v-if="uprs.id"
              target="_blank"
              @click.prevent="PrintUPR(uprs, uprItems)"
              class="button"
              tooltip="Print">
              <i class="nc-icon-mini tech_print"></i>
            </a><!-- 
            <a
              target="_blank"
              @click.prevent="downloadFile(uprs, uprItems)"
              class="button"
              tooltip="Download">
              <i class="nc-icon-mini arrows-1_cloud-download-95"></i>
            </a> -->
            <router-link to="upr-list-page" class="button button--pull-left" ><i class="nc-icon-mini arrows-1_tail-left"></i></router-link>  

            <router-link 
              v-if="uprs.id" :to="{ path: 'upr-edit-page', query: { uprId: uprs.id, uprDetails: uprs }}"class="button" ><i class="nc-icon-mini design_pen-01"></i></router-link>
          </div>

        </div>
        <!-- <upr-button  :upr="uprs" :signatories="signatories" :items="uprItems"></upr-button> -->
        <json-excel v-if="uprs.id" :data = "json_data" :items = "uprItems" :upr = "uprs" :fields = "json_fields" :meta = "json_meta" name = "draft-upr.xls"></json-excel>

        <div class="data-panel">

          <div class="data-panel__section">
            <ul class="data-panel__list">
              <li  class="data-panel__list__item">
                <strong  class="data-panel__list__item__label">Project Name:</strong>
                {{uprs.project_name}}
              </li>
              <li  class="data-panel__list__item">
                <strong  class="data-panel__list__item__label">
                UPR No. :</strong> {{uprs.upr_number}}
              </li>
              <li  class="data-panel__list__item">
                <strong  class="data-panel__list__item__label">Reference No. :</strong>
                {{uprs.ref_number}}
              </li>
              <li  class="data-panel__list__item">
                <strong  class="data-panel__list__item__label">
                Date Prepared :</strong> {{uprs.date_prepared}}
              </li>
              <li  class="data-panel__list__item">
                <strong  class="data-panel__list__item__label">Prepared by :</strong>
                {{uprs.prepared}} {{uprs.p_surname}}
              </li>
              <li  class="data-panel__list__item">
                <strong  class="data-panel__list__item__label">Procurement Centers/ Contracting Office :</strong>
                {{uprs.centers}}
              </li>
              <li  class="data-panel__list__item">
                <strong  class="data-panel__list__item__label">Mode of Procurement :</strong>
                <span v-if="uprs.modes">{{uprs.modes}}</span>
                <span v-if="!uprs.modes">Public Bidding</span>
              </li>
              <li  class="data-panel__list__item">
                <strong  class="data-panel__list__item__label">Place Of Delivery :</strong>
                {{uprs.place_of_delivery}}
              </li>
            </ul>
          </div>

          <div class="data-panel__section">

            <ul  class="data-panel__list">
              <li  class="data-panel__list__item">
                <strong  class="data-panel__list__item__label">Total ABC :</strong>
                {{formatPrice(uprs.total_amount)}}
              </li>
              <li  class="data-panel__list__item">
                <strong  class="data-panel__list__item__label">Created :</strong>
                {{uprs.created_at}}
              </li>
              <li  class="data-panel__list__item">
                <strong  class="data-panel__list__item__label">Procurement Program/Project :</strong>
                {{uprs.type}}
              </li>
              <li  class="data-panel__list__item">
                <strong  class="data-panel__list__item__label">Units :</strong>
                {{uprs.unit_code}}
              </li>
              <li class="data-panel__list__item">
                <strong  class="data-panel__list__item__label">Chargeability :</strong>
                {{uprs.charge}}
              </li>
              <li  class="data-panel__list__item">
                <strong  class="data-panel__list__item__label">Fund Validity :</strong>
                {{uprs.fund_validity}}
              </li>
            </ul>
          </div>

          <div class="data-panel__section">

            <ul  class="data-panel__list">
                <li  class="data-panel__list__item">
                  <strong  class="data-panel__list__item__label">Last Update :</strong>
                  {{uprs.updated_at}}
                </li>
                <li  class="data-panel__list__item">
                  <strong  class="data-panel__list__item__label">Terms of Payment :</strong>
                  {{uprs.terms}}
                </li>
                <li  class="data-panel__list__item">
                  <strong  class="data-panel__list__item__label">Status :</strong>
                  {{uprs.status}}
                </li>
                <li  class="data-panel__list__item">
                  <strong  class="data-panel__list__item__label">State :</strong>
                  {{uprs.state}}
                </li>
                <li  class="data-panel__list__item"  v-if="uprs.date_processed">
                  <strong  class="data-panel__list__item__label">Date Processed :</strong>
                  {{uprs.date_processed}}
                </li>
                <li  class="data-panel__list__item" v-if="uprs.processed_by">
                  <strong  class="data-panel__list__item__label">Processed By :</strong>
                   {{uprs.processed}} {{uprs.pr_surname}}
                </li>
                <li  class="data-panel__list__item" v-if="uprs.cancelled_at">
                  <strong  class="data-panel__list__item__label">Date Cancelled :</strong>
                  {{uprs.cancelled_at}}
                </li>
                <li  class="data-panel__list__item" v-if="uprs.cancel_reason">
                  <strong  class="data-panel__list__item__label">Cancel reason :</strong>
                  {{uprs.cancel_reason}}
                </li>
            </ul>
          </div>

        </div>

        <h3>Items</h3>

        <div class="row">
          <button v-if="uprs.status == 'draft'" class="button" @click.prevent="addItem">Add Item</button>
          <button type="button" @click.prevent="fileInputOpen" class="button pull-right" tooltip="Import"><i class="nc-icon-mini arrows-1_cloud-upload-96"></i></button>
        </div>

        <div class="row">
          <div class="twelve columns">
            <table class='table' id="item_table">
              <thead>
                <tr>
                    <th>Description</th>
                    <th>AccountCode</th>
                    <th>Qty</th>
                    <th>Unit</th>
                    <th>Unit Price</th>
                    <th>Amount</th>
                    <th></th>
                </tr>
              </thead>
              <tbody>
                <template  v-for="(item, index) in uprItems">
                  <tr>
                      <td>{{item.item_description}}</td>
                      <td>[{{item.old_account_code_name}}] {{item.new_account_code_name}} {{item.name_name}}</td>
                      <td>{{item.quantity}}</td>
                      <td>{{item.unit_measurement}}</td>
                      <td>{{item.unit_price}}</td>
                      <td>{{item.total_amount}}</td>
                      <td>
                        <a  v-if="uprs.status == 'draft'"  class="button"
                          @click.stop.prevent="editItem(item)">
                          edit
                        </a>

                        <a  v-if="uprs.status == 'draft'"  class="button"
                          @click.stop.prevent="deleteItem(item)">
                          <i class="nc-icon-outline ui-1_simple-remove"></i>
                        </a>
                      </td>
                  </tr>
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
  import VueNumeric from 'vue-numeric'
  import router from '../../../router'
  import TopBar from '../../LandingPage/TopBar'
  import SideBar from '../../LandingPage/SideBar'
  import Selectize from 'vue2-selectize'
  import UprButton from '../../ProcurementPage/UPR/Buttons'
  import JsonExcel from '../../ProcurementPage/UPR/JsonExcel'
  import { mapGetters, mapActions } from 'vuex'
  import { debounce } from 'lodash'
  import { db } from '../../../../server/db.js'
  import SelectaRemote from '../../Selecta/custom/SelectaAccountCodeTagging'
  var wkhtmltopdf = require('wkhtmltopdf')
  var moment = require('moment')
  var fs = require('fs')
  const uuidv1 = require('uuid/v1')
  var http = require('http')
  var path = require('path')

  var childProcess = require('child_process');
  var binPath  = require('wkhtmltopdf-installer').path;
  wkhtmltopdf.command = binPath
  import XLSX from 'xlsx';
  const _XLSX = require('xlsx');
  const X = typeof XLSX !== 'undefined' ? XLSX : _XLSX;
  const make_cols = refstr => Array(X.utils.decode_range(refstr).e.c + 1).fill(0).map((x,i) => ({name:X.utils.encode_col(i), key:i}));

  export default {
    name: 'upr-view-page',
    components: { SelectaRemote, VueNumeric, TopBar, SideBar, UprButton, JsonExcel, Selectize },
    methods: {
      ...mapActions([
        'createUprItem',
        'deleteUprItem',
        'updateUprItem',
        'updateUpr',
        'getUprEager',
        'getUprItem',
        'dropAccounts',
        'dropdownSignatory'
      
      ]),
      downloadFile(item, items){

        var dis = this
        this.$root.$children[0].loading = true
        const account_codes = []
        var itemRows = ""
        items.forEach(function(element, index) {
          account_codes.push(element.new_account_code_name)
          var indexCount = index + 1
          
          let totalamount = (element.total_amount/1).toFixed(2).replace(',', '.')
          totalamount = totalamount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

          itemRows = itemRows.concat("<tr>")
          itemRows = itemRows.concat("<td class='align-center'>"+indexCount+"</td>")
          itemRows = itemRows.concat("<td class='align-left'>"+element.item_description+"</td>")
          itemRows = itemRows.concat("<td class='align-center'>"+element.quantity+"</td>")
          itemRows = itemRows.concat("<td class='align-center'>"+element.unit_measurement+"</td>")
          itemRows = itemRows.concat("<td class='align-right'>"+element.unit_price+"</td>")
          itemRows = itemRows.concat("<td class='align-right'>"+totalamount+"</td>")
          itemRows = itemRows.concat("</tr>")
        });

        itemRows = itemRows.concat('<td class="align-center" colspan="6"><strong>x-x-x-x-x Nothing Follows x-x-x-x-x</strong></td>')

        for (var i = items.length ; i < 20; i++) {
          itemRows = itemRows.concat("<tr>")
          itemRows = itemRows.concat("<td class='align-center'>&nbsp;</td>")
          itemRows = itemRows.concat("<td class='align-left'>&nbsp;</td>")
          itemRows = itemRows.concat("<td class='align-center'>&nbsp;</td>")
          itemRows = itemRows.concat("<td class='align-center'>&nbsp;</td>")
          itemRows = itemRows.concat("<td class='align-right'>&nbsp;</td>")
          itemRows = itemRows.concat("<td class='align-right'>&nbsp;</td>")
          itemRows = itemRows.concat("</tr>")
        }

        var set = new Set(account_codes)
        var newAC = Array.from(set);
        var id = item.units
        var funder = item.fund_signatory_text
        var eplodedFunder = funder.split("/")
        var requestor = item.requestor_text
        var eplodedRequestor = requestor.split("/")
        var approver = item.approver_text
        var eplodedApprover = approver.split("/")

        db.serialize(function () {
          db.get('select * from form_headers where unit_id=?', {1: id}, function (err, result) {
            if (err != null) {
              console.log(err)
              dis.$root.$children[0].loading = false
            } 
            let parsed = fs.readFileSync(require('path').join(process.resourcesPath, "src/forms/upr-template.html"))
            var str = parsed.toString()
            var ref_number = item.ref_number
            if ( ref_number == null ) {
              var ref_number = ""
            }

            let val = (item.total_amount/1).toFixed(2).replace(',', '.')
            val = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            var content = ""
            if(result != null && result != '')
            {
              content = result.content
            }
            var tdate = moment(item.date_prepared).format('DD MMM YYYY');

            var newstr = str.replace(/{{headers}}/i, content)
            var newstr = newstr.replace(/{{place_of_delivery}}/i, item.place_of_delivery)
            var newstr = newstr.replace(/{{upr_number}}/i, item.upr_number)
            var newstr = newstr.replace(/{{modes}}/i, item.modes)
            var newstr = newstr.replace(/{{charge}}/i, item.charge)
            var newstr = newstr.replace(/{{ref_number}}/i, ref_number)
            var newstr = newstr.replace(/{{fund_validity}}/i, item.fund_validity)
            var newstr = newstr.replace(/{{terms}}/i, item.terms)
            var newstr = newstr.replace(/{{date_prepared}}/i, tdate)
            var newstr = newstr.replace(/{{other_infos}}/i, item.other_infos)
            var newstr = newstr.replace(/{{purpose}}/i, item.purpose)
            var newstr = newstr.replace(/{{total_amount}}/i, val)
            var newstr = newstr.replace(/{{items}}/i, itemRows)
            var newstr = newstr.replace(/{{account_codes}}/i, newAC.join(','))
            if (eplodedFunder.length == 4) {
              var newstr = newstr.replace(/{{funder_name}}/i, eplodedFunder[0])
              var newstr = newstr.replace(/{{funder_ranks}}/i, eplodedFunder[1])
              var newstr = newstr.replace(/{{funder_branch}}/i, eplodedFunder[2])
              var newstr = newstr.replace(/{{funder_designation}}/i, eplodedFunder[3])
            }
            if (eplodedRequestor.length == 4) {
              var newstr = newstr.replace(/{{requestor_name}}/i, eplodedRequestor[0])
              var newstr = newstr.replace(/{{requestor_ranks}}/i, eplodedRequestor[1])
              var newstr = newstr.replace(/{{requestor_branch}}/i, eplodedRequestor[2])
              var newstr = newstr.replace(/{{requestor_designation}}/i, eplodedRequestor[3])
            }
            if (eplodedApprover.length == 4) {
              var newstr = newstr.replace(/{{approver_name}}/i, eplodedApprover[0])
              var newstr = newstr.replace(/{{approver_ranks}}/i, eplodedApprover[1])
              var newstr = newstr.replace(/{{approver_branch}}/i, eplodedApprover[2])
              var newstr = newstr.replace(/{{approver_designation}}/i, eplodedApprover[3])
            } 
            var newstr = newstr.replace(/null/g, '')
            var newstr = newstr.replace(/undefined/g, '')

            var loc = require('path').join(process.resourcesPath, "src/download/upr-"+item.upr_number+".pdf")
            fs.writeFile(require('path').join(process.resourcesPath, "src/forms/test.html"), newstr, function (err) {

              if (err) {
                // alert('Error downloading file please try again.')
                dis.$root.$children[0].loading = false
              }

              var childArgs = [
                require('path').join(process.resourcesPath, "src/forms/test.html"),
                loc,
              ]

              childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
                if (stderr) {
                  console.log(stderr)
                }
                if (stdout) {
                  console.log(stdout)
                }
                if (err) {
                  console.log(err)
                  dis.$root.$children[0].loading = false
                }
              })
            });

            
            dis.$root.$children[0].loading = false
            
            var pdfPath = "src/download/upr-"+item.upr_number+".pdf"
            var filepath = "file://" + require('path').join(process.resourcesPath, pdfPath)

            dis.$electron.ipcRenderer.send('download-btn', filepath)

          })
        })


      },
      fileInputOpen (){
        // $("#file").click()

        $('#import-items-modal').addClass('is-visible')
      },

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
            if(i != 0)
            {
              this.itemModel.push({
                id: uuidv1(),
                upr_id: this.uprs.id,
                item_description: this.data[i][0],
                new_account_code: this.account_code,
                quantity: this.data[i][1],
                unit_measurement: this.data[i][2],
                unit_price: this.data[i][3],
                total_amount: this.data[i][4]
              })

            }
          }
          this.createUprItem([this.itemModel, this.uprs.id])
        };
        reader.readAsBinaryString(file)
        $('#import-items-modal').removeClass('is-visible')
      },
      keymonitor: function(e) {
        var a = [];
        var k = e.which;

        for (var i = 48; i < 58; i++)
            a.push(i);

        if (!($.inArray(k,a)>=0))
            e.preventDefault();
      },
      editItem(item){
        this.modelItems.id= item.id,
        this.modelItems.upr_id= item.upr_id,
        this.modelItems.item_description= item.item_description,
        this.modelItems.new_account_code= item.new_account_code,
        this.modelItems.quantity= item.quantity,
        this.modelItems.unit_measurement= item.unit_measurement,
        this.modelItems.unit_price= item.unit_price,
        this.modelItems.total_amount= item.total_amount
        $('#edit-account-code-modal').addClass('is-visible')
      },
      deleteItem(item){
        this.model.total_amount = parseInt(this.uprs.total_amount) - parseInt(item.total_amount)
        this.updateUpr([this.uprs.id, this.model])
        this.deleteUprItem([item.id, this.uprs.id])
      },
      updateItem()
      {
          this.updateUprItem([this.modelItems.id, this.modelItems, this.modelItems.upr_id])
          var total_a = 0
          for (var i = 0; i < this.uprItems.length; i++) {
            if(this.uprItems[i]['id'] != this.modelItems.id)
            {
              var total_a = parseInt(total_a) + parseInt(this.uprItems[i]['total_amount'])
            }
          }
          this.model.total_amount = parseInt(total_a) + parseInt(this.modelItems.total_amount)
          this.updateUpr([this.modelItems.upr_id, this.model])
          $('#edit-account-code-modal').removeClass('is-visible')

          this.modelItems.upr_id= null
          this.modelItems.item_description= null
          this.modelItems.new_account_code= null
          this.modelItems.quantity= 0
          this.modelItems.unit_measurement= null
          this.modelItems.unit_price= 0
          this.modelItems.total_amount= null
      },
      addCode(){
        // var code = $('#accountCode').val()
        var str = this.modelItems.new_account_code
        var newCode = str;
        // var newCode = str.replace("old-", "");
        // var newCode = newCode.replace("title-", "");
        this.modelItems.id = uuidv1()
        this.modelItems.upr_id = this.uprs.id
        this.modelItems.new_account_code = newCode
        this.createUprItem([[this.modelItems], this.uprs.id])
        this.model.total_amount = parseInt(this.uprs.total_amount) +  parseInt(this.modelItems.total_amount)
        this.updateUpr([this.modelItems.upr_id, this.model])
        this.modelItems.upr_id= null
        this.modelItems.item_description= null
        this.modelItems.new_account_code= null
        this.modelItems.quantity= 0
        this.modelItems.unit_measurement= null
        this.modelItems.unit_price= 0
        this.modelItems.total_amount= null
        $('#add-account-code-modal').removeClass('is-visible')
      },
      addItem () {
        $('#add-account-code-modal').addClass('is-visible')
      },
      formatPrice(value) {
          let val = (value/1).toFixed(2).replace(',', '.')
          return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      },
      PrintUPR (item, items) {
        var dis = this
        this.$root.$children[0].loading = true
        const account_codes = []
        var itemRows = ""
        items.forEach(function(element, index) {
          account_codes.push(element.new_account_code_name)
          var indexCount = index + 1
          
          let totalamount = (element.total_amount/1).toFixed(2).replace(',', '.')
          totalamount = totalamount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

          itemRows = itemRows.concat("<tr>")
          itemRows = itemRows.concat("<td class='align-center'>"+indexCount+"</td>")
          itemRows = itemRows.concat("<td class='align-left'>"+element.item_description+"</td>")
          itemRows = itemRows.concat("<td class='align-center'>"+element.quantity+"</td>")
          itemRows = itemRows.concat("<td class='align-center'>"+element.unit_measurement+"</td>")
          itemRows = itemRows.concat("<td class='align-right'>"+element.unit_price+"</td>")
          itemRows = itemRows.concat("<td class='align-right'>"+totalamount+"</td>")
          itemRows = itemRows.concat("</tr>")
        });

        itemRows = itemRows.concat('<td class="align-center" colspan="6"><strong>x-x-x-x-x Nothing Follows x-x-x-x-x</strong></td>')

        for (var i = items.length ; i < 15; i++) {
          itemRows = itemRows.concat("<tr>")
          itemRows = itemRows.concat("<td class='align-center'>&nbsp;</td>")
          itemRows = itemRows.concat("<td class='align-left'>&nbsp;</td>")
          itemRows = itemRows.concat("<td class='align-center'>&nbsp;</td>")
          itemRows = itemRows.concat("<td class='align-center'>&nbsp;</td>")
          itemRows = itemRows.concat("<td class='align-right'>&nbsp;</td>")
          itemRows = itemRows.concat("<td class='align-right'>&nbsp;</td>")
          itemRows = itemRows.concat("</tr>")
        }

        var set = new Set(account_codes)
        var newAC = Array.from(set);
        var id = item.units
        var funder = item.fund_signatory_text
        var eplodedFunder = ['','','','']
        if( funder != 'undefined' && funder != null){
          var eplodedFunder = funder.split("/")
        }
        var requestor = item.requestor_text
        var eplodedRequestor = ['','','','']
        if( requestor != 'undefined' && requestor != null){
          var eplodedRequestor = requestor.split("/")
        }
        var approver = item.approver_text
        var eplodedApprover = ['','','','']
        if( approver != 'undefined' && approver != null){
          var eplodedApprover = approver.split("/")
        }

        db.serialize(function () {
          db.get('select * from form_headers where unit_id=?', {1: id}, function (err, result) {
            if (err != null) {
              console.log(err)
              dis.$root.$children[0].loading = false
            } 
            let parsed = fs.readFileSync(require('path').join(process.resourcesPath, "src/forms/upr-template.html"))
            var str = parsed.toString()
            var ref_number = item.ref_number
            if ( ref_number == null ) {
              var ref_number = ""
            }

            let val = (item.total_amount/1).toFixed(2).replace(',', '.')
            val = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            var content = ""
            if(result != null && result != '')
            {
              content = result.content
            }

            var tdate = moment(item.date_prepared).format('DD MMM YYYY');
            var mode = item.modes

            if(mode == null || mode == 'undefined'){
              var mode = 'Public Bidding'
            }

            var newstr = str.replace(/{{headers}}/i, content)
            var newstr = newstr.replace(/{{place_of_delivery}}/i, item.place_of_delivery)
            var newstr = newstr.replace(/{{upr_number}}/i, item.upr_number)
            var newstr = newstr.replace(/{{modes}}/i, mode)
            var newstr = newstr.replace(/{{charge}}/i, item.charge)
            var newstr = newstr.replace(/{{ref_number}}/i, ref_number)
            var newstr = newstr.replace(/{{fund_validity}}/i, item.fund_validity)
            var newstr = newstr.replace(/{{terms}}/i, item.terms)
            var newstr = newstr.replace(/{{date_prepared}}/i, tdate)
            var newstr = newstr.replace(/{{other_infos}}/i, item.other_infos)
            var newstr = newstr.replace(/{{purpose}}/i, item.purpose)
            var newstr = newstr.replace(/{{total_amount}}/i, val)
            var newstr = newstr.replace(/{{items}}/i, itemRows)
            var newstr = newstr.replace(/{{account_codes}}/i, newAC.join(','))
            if (eplodedFunder.length == 4) {
              var newstr = newstr.replace(/{{funder_name}}/i, eplodedFunder[0])
              var newstr = newstr.replace(/{{funder_ranks}}/i, eplodedFunder[1])
              var newstr = newstr.replace(/{{funder_branch}}/i, eplodedFunder[2])
              var newstr = newstr.replace(/{{funder_designation}}/i, eplodedFunder[3])
            }
            if (eplodedRequestor.length == 4) {
              var newstr = newstr.replace(/{{requestor_name}}/i, eplodedRequestor[0])
              var newstr = newstr.replace(/{{requestor_ranks}}/i, eplodedRequestor[1])
              var newstr = newstr.replace(/{{requestor_branch}}/i, eplodedRequestor[2])
              var newstr = newstr.replace(/{{requestor_designation}}/i, eplodedRequestor[3])
            }
            if (eplodedApprover.length == 4) {
              var newstr = newstr.replace(/{{approver_name}}/i, eplodedApprover[0])
              var newstr = newstr.replace(/{{approver_ranks}}/i, eplodedApprover[1])
              var newstr = newstr.replace(/{{approver_branch}}/i, eplodedApprover[2])
              var newstr = newstr.replace(/{{approver_designation}}/i, eplodedApprover[3])
            } 
            var newstr = newstr.replace(/null/g, '')
            var newstr = newstr.replace(/undefined/g, '')

            var loc = require('path').join(process.resourcesPath, "src/download/upr-"+item.upr_number+".pdf")
            fs.writeFile(require('path').join(process.resourcesPath, "src/forms/test.html"), newstr, function (err) {

              if (err) {
                // alert('Error downloading file please try again.')
                dis.$root.$children[0].loading = false
              }

              var childArgs = [
                require('path').join(process.resourcesPath, "src/forms/test.html"),
                loc,
              ]

              childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
                if (err) {
                  console.log(err)
                  dis.$root.$children[0].loading = false
                }
              })
            });

            // var doc = wkhtmltopdf(newstr, { output: loc, pageSize: 'letter'})
            
            dis.$root.$children[0].loading = false
            router.push({
              name: 'view-pdf',
              query: { url: "src/download/upr-"+item.upr_number+".pdf", backUrl: "upr-list-page" }
            })

          })
        })
      }
    },
    mounted: function () { 
      this.dropdownSignatory()
      this.dropAccounts()
      this.getUprEager(this.$route.query.uprId)

      this.getUprItem(this.$route.query.uprId)
    },
    data () {
      return {
        json_fields : {},
        json_meta: [
          [{
            "key": "charset",
            "value": "utf-8"
          }]
        ],
        itemModel: [],
        modelItems: {
          id: null,
          upr_id: null,
          item_description: null,
          new_account_code: null,
          quantity: 0,
          unit_measurement: null,
          unit_price: 0,
          total_amount: null
        },
        model:{
          total_amount: 0
        },
        pagination: {
          total: 0,
          per_page: 1,
          from: 1,
          to: 0,
          current_page: 1
        },
        offset: 0,
        account_code: null,
        pageTitle: 'Unit Purchase Request'
      }
    },
    computed: {
      ...mapGetters([
        'uprs',
        'codesList',
        'signatories',
        'uprItems'
      ]),
      json_data: function () {
        return [
        ]
      },
      total: function() {
        var unit_price = this.modelItems.unit_price
        // if(unit_price != null)
        // {
        //   unit_price = unit_price.replace(/,/g , "");
        // }
        let calculatedTotal = this.modelItems.quantity * unit_price;
        this.modelItems.total_amount = calculatedTotal;
        return calculatedTotal;
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
      }
    }
  }
</script>
