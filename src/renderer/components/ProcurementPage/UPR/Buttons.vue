<template>
  <!-- buttons -->

  <div class="row">
    <div class="twelve columns align-right utility utility--align-right">
      <!-- <a href="#" id="attachment-button" class="button" tooltip="Attachments"> -->
        <!-- <i class="nc-icon-mini ui-1_attach-86"></i> -->
      <!-- </a> -->
      <a
        target="_blank"
        @click.prevent="PrintUPR(upr)"
        class="button"
        tooltip="Print">
        <i class="nc-icon-mini tech_print"></i>
      </a>
      <router-link v-if="upr.status == 'draft'" to="upr-draft-list-page" class="button button--pull-left" ><i class="nc-icon-mini arrows-1_tail-left"></i></router-link>


      <router-link  to="upr-list-page" class="button button--pull-left" ><i class="nc-icon-mini arrows-1_tail-left"></i></router-link>

    </div>

  </div>
</template>

<script>

  import { mapActions, mapGetters } from 'vuex'
  import router from '../../../router'
  import { db } from '../../../../server/db.js'
  var wkhtmltopdf = require('wkhtmltopdf')
  var fs = require('fs')
  const uuidv1 = require('uuid/v1')
  var http = require('http')
  var path = require('path')

  export default {
    components: {  },
    data () {
      return {
        name: 'upr-button',
        count: 0,
        iaarModel:[]
      }
    },
    props: ['upr', 'signatories', 'items'],
    computed: {
      ...mapGetters([
        'canvassings',
        'accountCodes',
        'purchaseOrderItems',
        'postQual',
        'deliveryInspection',
        'suppliers',
        'prebids',
        'rfq',
        'ntp',
        'documentAcceptance',
        'itb',
        'sobe',
        'preprocs',
        'vouchers',
        'inspectionReport',
        'nod',
        'purchaseOrders',
        'noa'
      ]),
      nextStage: function () {
        // Get next stage string
        if (this.upr.mode_of_procurement != 'public_bidding') {

          switch(this.upr.status) {
            case "upr_processing":
              return "Create Invitation"
              break;
            case "Philgeps Approved":
              return "Create RFQ"
              break;
            case "Processing RFQ":
              return "View RFQ"
              break;
            case "Philgeps Need Repost":
              return "PhilGeps Posting"
              break;
            case "Failed Bid":
              return "PhilGeps Posting"
              break;
            case "Invitation Created":
              if (this.upr.total_amount  > 50000) {
                return "PhilGeps Posting"
              } else {
                return "Create RFQ"
              }
              break;
            case "Close RFQ":
              return "Open Canvass"
              break;
            case "Open Canvass":
              return "View Canvass"
              break;
            default:

          }
        } else {

          switch(this.upr.status) {
            case "upr_processing":
              return "Document Acceptance"
              break;
            case "Document Accepted":
              return "Pre Proc"
              break;
            case "Failed Post Qualification":
              return "Pre Proc"
              break;
            case "Failed SOBE":
              return "Pre Proc"
              break;
            case "Failed Pre Bid":
              return "Pre Proc"
              break;
            case "Disqualification of Proponent":
              return "Pre Proc"
              break;
            case "PreProc Conference":
              return "Invitation To Bid"
              break;
            case "ITB Created":
              return "PhilGeps Posting"
              break;
            case "Philgeps Need Repost":
              return "PhilGeps Posting"
              break;
            case "Philgeps Approved":
              return "Pre-Bid Conference"
              break;
            case "Pre Bid Conference":
              return "SOBE"
              break;
            case "SOBE OPEN":
              return "View SOBE"
              break;
            case "SOBE Closed":
              return "Post Qualification"
              break;
            case "Post Qualification":
              return "View Post Qualification"
              break;
            default:
          }
        }

        switch(this.upr.status) {
          case "NOA Received":
            if (this.upr.mode_of_procurement != 'public_bidding') {
              return "Create PO"
            } else {
              return "Create Contract"
            }
            break;
          case "PO Created":
            return "View PO"
            break;
          case "Contract Created":
            return "View Contract"
            break;
          case "PO Funding Approved":
            if (this.upr.mode_of_procurement != 'public_bidding') {
              return "View PO"
            } else {
              return "View Contract"
            }
            break;
          case "PO MFO Approved":
            if (this.upr.mode_of_procurement != 'public_bidding') {
              return "View PO"
            } else {
              return "View Contract"
            }
            break;
          case "PO Approved":
            return "Prepare NTP"
            break;
          case "NTP Created":
            return "View Notice To Proceed"
            break;
          case "NTP Accepted":
            return "Create Notice Of Delivery"
            break;
          case "NOD Created":
            return "View Notice Of Delivery"
            break;
          case "Delivery Received":
            return "View Notice Of Delivery"
            break;
          case "Delivery Incomplete":
            return "View Notice Of Delivery"
            break;
          case "Delivery Partial":
            return "View Notice Of Delivery"
            break;
          case "Complete COA Delivery":
            return "Technical Inspection"
            break;
          case "Inspection Started":
            return "View Technical Inspection"
            break;
          case "Inspection Accepted":
            return "Delivered Items"
            break;
          case "DIIR Created":
            return "Delivered Items"
            break;
          case "DIIR Started":
            return "Delivered Items"
            break;
          case "DIIR Closed":
            return "Create Voucher"
            break;
          case "DIIR Closed":
            return "Voucher Created"
            break;
          case "Voucher Created":
            return "View Voucher"
            break;
          case "Voucher Preaudit":
            return "View Voucher"
            break;
          case "Voucher Certify":
            return "View Voucher"
            break;
          case "Voucher Journal Entry":
            return "View Voucher"
            break;
          case "Voucher Approved":
            return "View Voucher"
            break;
          case "Voucher Released":
            return "View Voucher"
            break;
          default:
            var string = this.upr.status
            if (string != null) {
              if (string.indexOf("Awarded To") == 0) {
                return "View NOA"
              }
            }
        }
      }
    },
    methods: {
      ...mapActions([
        'getRFQByUPR',
        'dropdownAccounts',
        'dropdownSuppliers',
        'getCanvassByUPR',
        'getPOByUPR',
        'getPOItemByUPR',
        'getPreprocByUPR',
        'getITBByUPR',
        'getDocumentAcceptanceByUPR',
        'getPostQualByUpr',
        'getNTPByUPR',
        'updateUpr',
        'createDIIR',
        'getNODByUPR',
        'getVoucherByUPR',
        'getDIIRByUPR',
        'getPrebidByUpr',
        'getSOBEByUpr',
        'getIAARByUPR',
        'getNOAByUPR',
      ]),
      mounted: function () {
        this.dropdownAccounts()
      },
      saveDIIR () {
        this.count ++
        if (this.count < 2) {

          this.iaarModel  = {
            id: uuidv1(),
            dr_id: this.nod.id,
            rfq_id: this.nod.rfq_id,
            upr_id: this.upr.id,
            rfq_number: this.nod.rfq_number,
            upr_number: this.nod.upr_number,
            delivery_number: this.nod.delivery_number,
            status: "pending",
          }
          this.createDIIR(this.iaarModel)
          this.updateUpr([this.nod.upr_id, {status:"DIIR Created"}])
          alert('Successfully updated')
        }
      },
      PrintUPR (item) {
        const account_codes = []
        var itemRows = ""
        this.items.forEach(function(element, index) {
          account_codes.push(element.new_account_code_name)
          var indexCount = index + 1
          itemRows = itemRows.concat("<tr>")
          itemRows = itemRows.concat("<td class='align-center'>"+indexCount+"</td>")
          itemRows = itemRows.concat("<td class='align-left'>"+element.item_description+"</td>")
          itemRows = itemRows.concat("<td class='align-center'>"+element.quantity+"</td>")
          itemRows = itemRows.concat("<td class='align-center'>"+element.unit_measurement+"</td>")
          itemRows = itemRows.concat("<td class='align-right'>"+element.unit_price+"</td>")
          itemRows = itemRows.concat("<td class='align-right'>"+element.total_amount+"</td>")
          itemRows = itemRows.concat("</tr>")
        });
        

        itemRows = itemRows.concat('<td class="align-center" colspan="6"><strong>x-x-x-x-x Nothing Follows x-x-x-x-x</strong></td>')

        for (var i = 20 - items.length ; i < 20; i++) {
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
            }
            let parsed = fs.readFileSync(require('path').resolve('src/renderer/forms/upr-template.html'))
            var str = parsed.toString()
            var newstr = str.replace(/{{headers}}/i, result.content)
            var newstr = newstr.replace(/{{place_of_delivery}}/i, item.place_of_delivery)
            var newstr = newstr.replace(/{{upr_number}}/i, item.upr_number)
            var newstr = newstr.replace(/{{modes}}/i, item.modes)
            var newstr = newstr.replace(/{{charge}}/i, item.charge)
            var newstr = newstr.replace(/{{ref_number}}/i, item.ref_number)
            var newstr = newstr.replace(/{{fund_validity}}/i, item.fund_validity)
            var newstr = newstr.replace(/{{terms}}/i, item.terms)
            var newstr = newstr.replace(/{{date_prepared}}/i, item.date_prepared)
            var newstr = newstr.replace(/{{other_infos}}/i, item.other_infos)
            var newstr = newstr.replace(/{{purpose}}/i, item.purpose)
            var newstr = newstr.replace(/{{total_amount}}/i, item.total_amount)
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
            var res = fs.createWriteStream(require('path').resolve('downloads/'+item.upr_number+'.pdf'))
            var doc = wkhtmltopdf(newstr, { pageSize: 'letter'}).pipe(res)
            
            router.push({
              name: 'view-pdf',
              query: { url: "src/download/upr-"+item.upr_number+".pdf", backUrl: "upr-list-page" }
            })
            // wkhtmltopdf(newstr, { pageSize: 'letter' }, function (err, stream) {
            //   // do whatever with the stream
            //   console.log(stream)
            //   console.log(stream.stdout)
            // });
            // console.log(doc.stdout)

          })
        })
      },
      viewTimelines() {
        this.$router.push({ path: 'upr-timelines-page', query: { uprId: this.upr.id  }})
      },
      viewDisqualify () {
        var string = this.upr.status
        if (string != null) {
          if (this.upr.mode_of_procurement == 'public_bidding' && this.upr.status == 'Approved NOA' && string.indexOf("Awarded To") == 0) {
            return true
          }
        }
      },
      viewBidDocsIssuance () {
        if (this.upr.status == 'Philgeps Approved'|| this.upr.status == 'Pre Bid Conference' ) {
          return true
        }
      },
      confirmUpr () {
        $('#confirm-modal').addClass('is-visible')
      },
      openBidDocs () {
        $('#bid-docs-modal').addClass('is-visible')
      },
      viewDelivery () {
        if (this.upr.delivery_order >= 1) {
          return true
        }
      },
      nextLink () {

        if (this.upr.mode_of_procurement != 'public_bidding') {
          switch(this.upr.status) {
            case "Processing RFQ":
              this.$router.push({ path: 'rfq-view-page', query: { uprId: this.rfq.upr_id, rfqId: this.rfq.id  }})
              return "upr-list-page"
              break;
            case "Open Canvass":
              this.$router.push({ path: 'canvassing-view-page', query: { uprId: this.canvassings.id, rfqId: this.canvassings.rfq_id  }})
              break;
            case "Approved NOA":
              this.$router.push({ path: 'noa-view-page', query: { uprId: this.noa.id, rfqId: this.noa.proponent_id  }})
              break;
            case "NOA Received":
              this.$router.push({ path: 'po-form-page', query: { uprId: this.upr.id, uprMode: this.upr.mode_of_procurement, uprRef: this.upr.ref_number }})
              break;
            case "PO Created":
              this.$router.push({ path: 'po-view-page', query: { uprId: this.purchaseOrders.id, upr: this.purchaseOrders.upr_id }})
              break;
            case "PO Funding Approved":
              this.$router.push({ path: 'po-view-page', query: { uprId: this.purchaseOrders.id, upr: this.purchaseOrders.upr_id }})
              break;
            case "PO MFO Approved":
              this.$router.push({ path: 'po-view-page', query: { uprId: this.purchaseOrders.id, upr: this.purchaseOrders.upr_id }})
              break;
            case "Contract Created":
              this.$router.push({ path: 'po-view-page', query: { uprId: this.purchaseOrders.id, upr: this.purchaseOrders.upr_id }})
              break;
            case "NTP Created":
              this.$router.push({ path: 'ntp-view-page', query: { uprId: this.ntp.id, upr: this.ntp.upr_id }})
              break;
            case "NOD Created":
              this.$router.push({ path: 'nod-view-page', query: { uprId: this.nod.id, upr: this.nod.upr_id }})
              break;
            case "Delivery Received":
              this.$router.push({ path: 'nod-view-page', query: { uprId: this.nod.id, upr: this.nod.upr_id }})
              break;
            case "Delivery Incomplete":
              this.$router.push({ path: 'nod-view-page', query: { uprId: this.nod.id, upr: this.nod.upr_id }})
              return true
              break;
            case "Delivery Partial":
              this.$router.push({ path: 'nod-view-page', query: { uprId: this.nod.id, upr: this.nod.upr_id }})
              return true
              break;
            case "Complete COA Delivery":
              this.$router.push({ path: 'iaar-form-page', query: { uprId: this.nod.id, upr: this.nod.upr_id }})
              return true
              break;
            case "Inspection Started":
              this.$router.push({ path: 'iaar-view-page', query: { uprId: this.inspectionReport.id, upr: this.inspectionReport.upr_id }})
              return true
              break;
            case "DIIR Created":
              this.$router.push({ path: 'diir-view-page', query: { uprId: this.deliveryInspection.id, upr: this.deliveryInspection.upr_id }})
              return true
            case "DIIR Started":
              this.$router.push({ path: 'diir-view-page', query: { uprId: this.deliveryInspection.id, upr: this.deliveryInspection.upr_id }})
              return true
              break;
            case "Voucher Created":
              this.$router.push({ path: 'voucher-view-page', query: { uprId: this.vouchers.id, upr: this.vouchers.upr_id }})
              return true
              break;
            default:
              var string = this.upr.status
              if (string != null) {
                if (string.indexOf("Awarded To") == 0) {
                  this.$router.push({ path: 'noa-view-page', query: { uprId: this.noa.id, rfqId: this.noa.proponent_id  }})
                }
              }
              return "upr-list-page"
          }
        } else {

          switch(this.upr.status) {
            case "upr_processing":
              this.$router.push({ path: 'document-acceptance-form-page', query: { uprId: this.upr.id}})
              return "upr-list-page"
              break;
            case "Philgeps Approved":
              this.$router.push({ path: 'pre-bid-form-page', query: { uprId: this.upr.id}})
              return "upr-list-page"
              break;
            case "SOBE OPEN":
              this.$router.push({ path: 'sobe-view-page', query: { uprId: this.sobe.id, upr: this.sobe.upr_id }})
              return true
              break;
            case "Post Qualification":
              this.$router.push({ path: 'post-qual-view-page', query: { uprId: this.postQual.id, upr: this.postQual.upr_id }})
              return true
              break;
            case "NOA Received":
              this.$router.push({ path: 'po-form-page', query: { uprId: this.upr.id, uprMode: this.upr.mode_of_procurement, uprRef: this.upr.ref_number}})
              break;
            case "PO Created":
              this.$router.push({ path: 'contract-bid-view-page', query: { uprId: this.purchaseOrders.id, upr: this.purchaseOrders.upr_id }})
              break;
            case "Contract Created":
              this.$router.push({ path: 'contract-bid-view-page', query: { uprId: this.purchaseOrders.id, upr: this.purchaseOrders.upr_id }})
              break;
            case "PO Funding Approved":
              this.$router.push({ path: 'po-view-page', query: { uprId: this.purchaseOrders.id, upr: this.purchaseOrders.upr_id }})
              break;
            case "PO MFO Approved":
              console.log(this.purchaseOrders)
              this.$router.push({ path: 'po-view-page', query: { uprId: this.purchaseOrders.id, upr: this.purchaseOrders.upr_id }})
              break;
            case "NTP Created":
              this.$router.push({ path: 'ntp-bid-view-page', query: { uprId: this.ntp.id, upr: this.ntp.upr_id }})
              break;
            case "NOD Created":
              this.$router.push({ path: 'nod-bid-view-page', query: { uprId: this.nod.id, upr: this.nod.upr_id }})
              break;
            case "Delivery Received":
              this.$router.push({ path: 'nod-view-page', query: { uprId: this.nod.id, upr: this.nod.upr_id }})
              break;
            case "Complete COA Delivery":
              this.$router.push({ path: 'iaar-form-page', query: { uprId: this.nod.id, upr: this.nod.upr_id }})
              return true
              break;
            case "Inspection Started":
              this.$router.push({ path: 'iaar-bid-view-page', query: { uprId: this.inspectionReport.id, upr: this.inspectionReport.upr_id }})
              return true
              break;
            case "DIIR Created":
              this.$router.push({ path: 'diir-bid-view-page', query: { uprId: this.deliveryInspection.id, upr: this.deliveryInspection.upr_id }})
              return true
            case "DIIR Started":
              this.$router.push({ path: 'diir-bid-view-page', query: { uprId: this.deliveryInspection.id, upr: this.deliveryInspection.upr_id }})
              return true
              break;
            case "Voucher Created":
              this.$router.push({ path: 'voucher-bid-view-page', query: { uprId: this.vouchers.id, upr: this.vouchers.upr_id }})
              return true
              break;

            default:
              var string = this.upr.status
              if (string != null) {
                if (string.indexOf("Awarded To") == 0) {
                  if(this.upr.mode_of_procurement != 'public_bidding') {
                    this.$router.push({ path: 'noa-view-page', query: { uprId: this.noa.id, rfqId: this.noa.proponent_id  }})
                  } else {
                    this.$router.push({ path: 'noa-bid-view-page', query: { uprId: this.noa.id, rfqId: this.noa.proponent_id  }})
                  }
                }
              }
              return "upr-list-page"
            }
          }
      },
      isLink () {
        // check if button will be modal or link
        if (this.upr.mode_of_procurement != 'public_bidding') {

          switch(this.upr.status) {
            case "upr_processing":
              return false
              break;
            case "Philgeps Approved":

              if (this.suppliers.length == 0) {
                this.dropdownSuppliers()
              }
              return false
              break;
            case "Processing RFQ":
              this.getRFQByUPR(this.upr.id)
              return true
              break;
            case "Philgeps Need Repost":
              return false
              break;
            case "Failed Bid":
              return false
              break;
            case "Invitation Created":
                return false
              break;
            case "Close RFQ":
              return false
              break;
            case "Open Canvass":
              this.getCanvassByUPR(this.upr.id)
              return true
              break;
            default:
          }

        } else {
          switch(this.upr.status) {
            case "upr_processing":
              return true
              break;
            case "Document Accepted":
              this.getDocumentAcceptanceByUPR(this.upr.id)
              return false
              break;
            case "Failed Post Qualification":
              return false
              break;
            case "Failed SOBE":
              return true
              break;
            case "Failed Pre Bid":
              return true
              break;
            case "Disqualification of Proponent":
              return true
              break;
            case "PreProc Conference":
              this.getPreprocByUPR(this.upr.id)
              return false
              break;
            case "ITB Created":
              this.getPreprocByUPR(this.upr.id)
              return false
              break;
            case "Philgeps Need Repost":
              return true
              break;
            case "Philgeps Approved":
              this.dropdownSuppliers()
              return true
              break;
            case "Pre Bid Conference":

              if (this.prebids.id == undefined) {
                this.getPrebidByUpr(this.upr.id)
              }
              return false
              break;
            case "SOBE OPEN":
              if (this.sobe.id == undefined) {
                this.getSOBEByUpr(this.upr.id)
              }
              return true
              break;
            case "SOBE Closed":
              if (this.sobe.id == undefined) {
                this.getSOBEByUpr(this.upr.id)
              }
              return false
              break;
            case "Post Qualification":

              if (this.postQual.id == undefined) {
                this.getPostQualByUpr(this.upr.id)
              }
              return true
              break;
            default:
          }
        }

        switch(this.upr.status) {
          case "Approved NOA":
            this.getNOAByUPR(this.upr.id)
            return true
            break;
          case "NOA Received":
            this.getNOAByUPR(this.upr.id)
            return true
            break;
          case "PO Created":
            this.getPOByUPR(this.upr.id)
            return true
            break;
          case "Contract Created":
            this.getPOByUPR(this.upr.id)
            return true
            break;
          case "PO Funding Approved":
            this.getPOByUPR(this.upr.id)
            return true
            break;
          case "PO MFO Approved":
            this.getPOByUPR(this.upr.id)
            return true
            break;
          case "PO Approved":
            this.getPOByUPR(this.upr.id)
            this.getNOAByUPR(this.upr.id)
            return false
            break;
          case "NTP Created":
            this.getNTPByUPR(this.upr.id)
            return true
            break;
          case "NTP Accepted":
            if (this.ntp.id == undefined) {
              this.getNTPByUPR(this.upr.id)
            }

            if (this.purchaseOrders.id == undefined) {
              this.getPOByUPR(this.upr.id)
            }
            if (this.purchaseOrderItems.length == 0) {
              this.getPOItemByUPR(this.upr.id)
            }
            return false
            break;
          case "NOD Created":
            if (this.nod.id == undefined) {
              this.getNODByUPR(this.upr.id)
            }
            return true
            break;
          case "Delivery Received":
            if (this.nod.id == undefined) {
              this.getNODByUPR(this.upr.id)
            }
            return true
            break;
          case "Delivery Incomplete":
            if (this.nod.id == undefined) {
              this.getNODByUPR(this.upr.id)
            }
            return true
            break;
          case "Delivery Partial":
            if (this.nod.id == undefined) {
              this.getNODByUPR(this.upr.id)
            }
            return true
            break;
          case "Complete COA Delivery":
            if (this.nod.id == undefined) {
              this.getNODByUPR(this.upr.id)
            }
            return true
            break;
          case "Inspection Started":
            if (this.inspectionReport.id == undefined) {
              this.getIAARByUPR(this.upr.id)
            }
            return true
            break;
          case "Inspection Accepted":
            if (this.nod.id == undefined) {
              this.getNODByUPR(this.upr.id)
            }
            return false
            break;
          case "DIIR Created":
              this.getDIIRByUPR(this.upr.id)
            return true
            break;
          case "DIIR Started":
            if (this.deliveryInspection.id == undefined) {
              this.getDIIRByUPR(this.upr.id)
            return true
            }
            break;
          case "DIIR Closed":
            if (this.deliveryInspection.id == undefined) {
              this.getDIIRByUPR(this.upr.id)
            }
            return false
            break;
          case "DIIR Closed":
            return true
            break;
          case "Voucher Created":
            if (this.vouchers.id == undefined) {
              this.getVoucherByUPR(this.upr.id)
            }
            return true
            break;
          case "Voucher Preaudit":
            return true
            break;
          case "Voucher Certify":
            return true
            break;
          case "Voucher Journal Entry":
            return true
            break;
          case "Voucher Approved":
            return true
            break;
          case "Voucher Released":
            return true
            break;
          default:
            var string = this.upr.status
            if (string != null) {
              if (string.indexOf("Awarded To") == 0) {
                if( this.noa.id == undefined) {
                  this.getNOAByUPR(this.upr.id)
                }
                return true
              }
            }
        }
      },
      openModal () {
        if (this.upr.mode_of_procurement != 'public_bidding') {

          switch(this.upr.status) {
            case "upr_processing":
              $('#invitation-modal').addClass('is-visible')
              break;
            case "Philgeps Approved":
              $('#process-modal').addClass('is-visible')
              break;
            case "Processing RFQ":
              return true
              break;
            case "Philgeps Need Repost":
              return false
              break;
            case "Failed Bid":
              return false
              break;
            case "Invitation Created":
              if (this.upr.total_amount  > 50000) {
                $('#philgeps-posting-modal').addClass('is-visible')
              }
              else {
                $('#process-modal').addClass('is-visible')
              }
              break;
            case "Close RFQ":
              this.getRFQByUPR(this.upr.id)
              $('#open_canvass-modal').addClass('is-visible')
              break;
            case "PO Approved":
              $('#ntp-modal').addClass('is-visible')
              break;
            case "Open Canvass":
              return true
              break;
            case "NTP Accepted":
              $('#create-delivery-modal').addClass('is-visible')
              break;
            case "Inspection Accepted":
              this.saveDIIR()
              break;
            case "DIIR Closed":
              $('#voucher-modal').addClass('is-visible')
              break;
            default:
          }

        } else {
          switch(this.upr.status) {
            case "upr_processing":
              return true
              break;
            case "Document Accepted":
              $('#preproc-modal').addClass('is-visible')
              return true
              break;
            case "Failed Post Qualification":
              return true
              break;
            case "Failed SOBE":
              return true
              break;
            case "Failed Pre Bid":
              return true
              break;
            case "Disqualification of Proponent":
              return true
              break;
            case "PreProc Conference":
              $('#itb-modal').addClass('is-visible')
              return true
              break;
            case "ITB Created":
              return true
              break;
            case "Philgeps Need Repost":
              return true
              break;
            case "Philgeps Approved":
              return false
              break;
            case "Pre Bid Conference":
              $('#open-bid-modal').addClass('is-visible')
              return true
              break;
            case "SOBE OPEN":
              return false
              break;
            case "SOBE Closed":
              $('#post-qual-modal').addClass('is-visible')
              return true
              break;
            case "Post Qualification":
              return false
              break;
            case "PO Approved":
              $('#ntp-modal').addClass('is-visible')
              break;
            case "NTP Accepted":
              $('#create-delivery-modal').addClass('is-visible')
              break;
            case "Inspection Accepted":
              this.saveDIIR()
              break;
            case "DIIR Closed":
              $('#voucher-modal').addClass('is-visible')
              break;
            default:
          }
        }
      }

    }
  }
</script>
