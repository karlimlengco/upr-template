<template>
  <div class="container">
    <top-bar></top-bar>
    <side-bar></side-bar>

    <div class="content">
      <div class="content__wrapper">

        <div class="row">
          <div class="six columns utility utility--align-right" style="margin-bottom:0px" >
            <router-link :to="{ path: 'upr-view-page', query: { uprId: uprs.id  }}" class="button button--pull-left" ><i class="nc-icon-mini  arrows-1_tail-left"></i></router-link>
          </div>
        </div>
        <br>

        <div class="data-panel" style="padding:10px; margin-bottom:10px">
          <div class="data-panel__section">
              <ul class="data-panel__list">
                  <li class="data-panel__list__item"> <strong class="data-panel__list__item__label" style="font-weight:800; text-transform:capitalize">Ref No :</strong> {{uprs.ref_number}} </li>
              </ul>
          </div>
          <div class="data-panel__section">
              <ul class="data-panel__list">
                  <li class="data-panel__list__item"> <strong class="data-panel__list__item__label" style="font-weight:800; text-transform:capitalize">UPR No :</strong> {{uprs.upr_number}} </li>
              </ul>
          </div>
          <div class="data-panel__section">
              <ul class="data-panel__list">
                  <li class="data-panel__list__item"> <strong class="data-panel__list__item__label" style="font-weight:800; text-transform:capitalize">Project Name :</strong> {{uprs.project_name}} </li>
              </ul>
          </div>
        </div>

        <br>
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Allowable Time</th>
              <th>W Day/s</th>
              <th>Justification/Remarks</th>
              <th>Action Taken</th>
              <!-- <th>Print</th> -->
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>UPR</td>
              <td>{{uprs.date_prepared}}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>
              </td>
            </tr>
            <tr v-if="uprs.mode_of_procurement == 'public_bidding'">
              <td>Document Acceptance</td>
              <td>{{uprs.doc_transaction_date}}</td>
              <td>1</td>
              <td>{{uprs.doc_days}} <strong class="red" tooltip="Delay" v-if="uprs.doc_days > 1">({{uprs.doc_days - 1}})</strong></td>
              <td>{{uprs.doc_remarks}}</td>
              <td>{{uprs.doc_action}}</td>
              <td>
              </td>
            </tr>
            <tr v-if="uprs.mode_of_procurement == 'public_bidding'">
              <td>Pre Proc Conference</td>
              <td>{{uprs.pre_proc_pre_proc_date}}</td>
              <td>1</td>
              <td>{{uprs.pre_proc_days}} <strong class="red" tooltip="Delay" v-if="uprs.pre_proc_days > 1">({{uprs.pre_proc_days - 1}})</strong></td>
              <td>{{uprs.doc_remarks}}</td>
              <td>{{uprs.doc_action}}</td>
              <td>
              </td>
            </tr>
            <tr v-if="uprs.mode_of_procurement == 'public_bidding'">
              <td>Invitation To Bid</td>
              <td>{{uprs.invitation_to_bid_approved_date}}</td>
              <td>7</td>
              <td>{{uprs.invitation_to_bid_days}} <strong class="red" tooltip="Delay" v-if="uprs.invitation_to_bid_days > 7">({{uprs.invitation_to_bid_days - 7}})</strong></td>
              <td>{{uprs.invitation_to_bid_remarks}}</td>
              <td>{{uprs.invitation_to_bid_action}}</td>
              <td>
              </td>
            </tr>
            <tr v-if="uprs.mode_of_procurement == 'public_bidding'">
              <td>Philgeps Posting</td>
              <td>{{uprs.pp_completed_at}}</td>
              <td>7</td>
              <td>{{uprs.pp_days}} <strong class="red" tooltip="Delay" v-if="uprs.pp_days > 7">({{uprs.pp_days - 7}})</strong></td>
              <td>{{uprs.pp_remarks}}</td>
              <td>{{uprs.pp_action}}</td>
              <td>
              </td>
            </tr>
            <tr v-if="uprs.mode_of_procurement == 'public_bidding'">
              <td>Pre Bid Conference</td>
              <td>{{uprs.pre_bid_transaction_date}}</td>
              <td>1</td>
              <td>{{uprs.pre_bid_days}} <strong class="red" tooltip="Delay" v-if="uprs.pre_bid_days > 1">({{uprs.pre_bid_days - 1}})</strong></td>
              <td>{{uprs.pre_bid_remarks}}</td>
              <td>{{uprs.pre_bid_action}}</td>
              <td>
              </td>
            </tr>
            <tr v-if="uprs.mode_of_procurement == 'public_bidding'">
              <td>SOBE</td>
              <td>{{uprs.bid_opening_transaction_date}}</td>
              <td>45</td>
              <td>{{uprs.bid_opening_days}} <strong class="red" tooltip="Delay" v-if="uprs.bid_opening_days > 45">({{uprs.bid_opening_days - 45}})</strong></td>
              <td>{{uprs.bid_opening_remarks}}</td>
              <td>{{uprs.bid_opening_action}}</td>
              <td>
              </td>
            </tr>
            <tr v-if="uprs.mode_of_procurement == 'public_bidding'">
              <td>Closing SOBE</td>
              <td>{{uprs.closing_date}}</td>
              <td>7</td>
              <td>{{uprs.bid_opening_days}} <strong class="red" tooltip="Delay" v-if="uprs.bid_opening_days > 7">({{uprs.bid_opening_days - 7}})</strong></td>
              <td>{{uprs.bid_opening_remarks}}</td>
              <td>{{uprs.bid_opening_action}}</td>
              <td>
              </td>
            </tr>
            <tr v-if="uprs.mode_of_procurement == 'public_bidding'">
              <td>Post Qualification</td>
              <td>{{uprs.post_qualification_transaction_date}}</td>
              <td>45</td>
              <td>{{uprs.post_qualification_days}} <strong class="red" tooltip="Delay" v-if="uprs.post_qualification_days > 45">({{uprs.post_qualification_days - 45}})</strong></td>
              <td>{{uprs.post_qualification_remarks}}</td>
              <td>{{uprs.post_qualification_action}}</td>
              <td>
              </td>
            </tr>
            <tr v-if="uprs.mode_of_procurement != 'public_bidding'">
              <td>Create Invitation</td>
              <td>{{uprs.ispq_transaction_date}}</td>
              <td>3</td>
              <td>{{uprs.pre_proc_days}} <strong class="red" tooltip="Delay" v-if="uprs.pre_proc_days > 3">({{uprs.pre_proc_days - 3}})</strong></td>
              <td>{{uprs.pre_proc_remarks}}</td>
              <td>{{uprs.pre_proc_action}}</td>
              <td>
              </td>
            </tr>
            <tr  v-if="uprs.mode_of_procurement != 'public_bidding'">
              <td>Philgeps Posting</td>
              <td>{{uprs.pp_completed_at}}</td>
              <td>3</td>
              <td>{{uprs.pp_days}} <strong class="red" tooltip="Delay" v-if="uprs.pp_days > 3">({{uprs.pp_days - 3}})</strong></td>
              <td>{{uprs.pp_remarks}}</td>
              <td>{{uprs.pp_action}}</td>
              <td>
              </td>
            </tr>
            <tr v-if="uprs.mode_of_procurement != 'public_bidding'">
              <td>Close RFQ</td>
              <td>{{uprs.rfq_completed_at}}</td>
              <td>3</td>
              <td>{{uprs.rfq_closed_days}} <strong class="red" tooltip="Delay" v-if="uprs.rfq_closed_days > 3">({{uprs.rfq_closed_days - 3}})</strong></td>
              <td>{{uprs.rfq_close_remarks}}</td>
              <td>{{uprs.rfq_close_action}}</td>
              <td>
              </td>
            </tr>
            <tr v-if="uprs.mode_of_procurement != 'public_bidding'">
              <td>Canvassing</td>
              <td>{{uprs.canvass_start_date}}</td>
              <td>2</td>
              <td>{{uprs.canvass_days}} <strong class="red" tooltip="Delay" v-if="uprs.canvass_days > 2">({{uprs.canvass_days - 2}})</strong></td>
              <td>{{uprs.canvass_remarks}}</td>
              <td>{{uprs.canvass_action}}</td>
              <td>
              </td>
            </tr>
            <tr>
              <td>Prepare Notice Of Award</td>
              <td>{{uprs.noa_award_date}}</td>
              <td  v-if="uprs.mode_of_procurement != 'public_bidding'">2</td>
              <td  v-if="uprs.mode_of_procurement != 'public_bidding'">{{uprs.noa_days}} <strong class="red" tooltip="Delay" v-if="uprs.noa_days > 2">({{uprs.noa_days - 2}})</strong></td>

              <td  v-if="uprs.mode_of_procurement == 'public_bidding'">15</td>
              <td  v-if="uprs.mode_of_procurement == 'public_bidding'">{{uprs.noa_days}} <strong class="red" tooltip="Delay" v-if="uprs.noa_days > 15">({{uprs.noa_days - 15}})</strong></td>

              <td>{{uprs.noa_remarks}}</td>
              <td>{{uprs.noa_action}}</td>
              <td>
              </td>
            </tr>
            <tr>
              <td>Approved Notice Of Award</td>
              <td>{{uprs.noa_approved_date}}</td>
              <td >1</td>
              <td >{{uprs.noa_approved_days}} <strong class="red" tooltip="Delay" v-if="uprs.noa_approved_days > 1">({{uprs.noa_approved_days - 1}})</strong></td>

              <td>{{uprs.noa_approved_remarks}}</td>
              <td>{{uprs.noa_approved_action}}</td>
              <td>
              </td>
            </tr>
            <tr>
              <td>Received Notice Of Award</td>
              <td>{{uprs.noa_award_accepted_date}}</td>
              <td >1</td>
              <td >{{uprs.noa_received_days}} <strong class="red" tooltip="Delay" v-if="uprs.noa_received_days > 1">({{uprs.noa_received_days - 1}})</strong></td>

              <td>{{uprs.noa_received_remarks}}</td>
              <td>{{uprs.noa_received_action}}</td>
              <td>
              </td>
            </tr>
            <tr>
              <td  v-if="uprs.mode_of_procurement != 'public_bidding'">PO Creation</td>
              <td  v-if="uprs.mode_of_procurement == 'public_bidding'">Contract Creation</td>
              <td>{{uprs.po_create_date}}</td>
              <td v-if="uprs.mode_of_procurement != 'public_bidding'">2</td>
              <td v-if="uprs.mode_of_procurement != 'public_bidding'">{{uprs.po_days}} <strong class="red" tooltip="Delay" v-if="uprs.po_days > 2">({{uprs.po_days - 2}})</strong></td>
              <td v-if="uprs.mode_of_procurement == 'public_bidding'">10</td>
              <td v-if="uprs.mode_of_procurement == 'public_bidding'">{{uprs.po_days}} <strong class="red" tooltip="Delay" v-if="uprs.po_days > 10">({{uprs.po_days - 10}})</strong></td>

              <td>{{uprs.po_remarks}}</td>
              <td>{{uprs.po_action}}</td>
              <td>
              </td>
            </tr>
            <tr>
              <td  v-if="uprs.mode_of_procurement != 'public_bidding'">PO Funding</td>
              <td  v-if="uprs.mode_of_procurement == 'public_bidding'">Contract Funding</td>
              <td>{{uprs.funding_received_date}}</td>
              <td>2</td>
              <td>{{uprs.po_fund_days}} <strong class="red" tooltip="Delay" v-if="uprs.po_fund_days > 2">({{uprs.po_fund_days - 2}})</strong></td>

              <td>{{uprs.po_funding_remarks}}</td>
              <td>{{uprs.po_funding_action}}</td>
              <td>
              </td>
            </tr>
            <tr>
              <td  v-if="uprs.mode_of_procurement != 'public_bidding'">PO MFO Funding/Obligation</td>
              <td  v-if="uprs.mode_of_procurement == 'public_bidding'">Contract MFO Funding/Obligation</td>
              <td>{{uprs.mfo_received_date}}</td>
              <td>2</td>
              <td>{{uprs.po_mfo_days}} <strong class="red" tooltip="Delay" v-if="uprs.po_mfo_days > 2">({{uprs.po_mfo_days - 2}})</strong></td>

              <td>{{uprs.po_mfo_remarks}}</td>
              <td>{{uprs.po_mfo_action}}</td>
              <td>
              </td>
            </tr>
            <tr>
              <td  v-if="uprs.mode_of_procurement != 'public_bidding'">PO COA Approval</td>
              <td  v-if="uprs.mode_of_procurement == 'public_bidding'">Contract COA Approval</td>
              <td>{{uprs.coa_approved_date}}</td>
              <td>1</td>
              <td>{{uprs.po_coa_days}} <strong class="red" tooltip="Delay" v-if="uprs.po_coa_days > 1">({{uprs.po_coa_days - 1}})</strong></td>

              <td>{{uprs.po_coa_remarks}}</td>
              <td>{{uprs.po_coa_action}}</td>
              <td>
              </td>
            </tr>
            <tr>
              <td>Prepare Notice to Proceed</td>
              <td>{{uprs.ntp_date}}</td>
              <td v-if="uprs.mode_of_procurement != 'public_bidding'">1</td>
              <td v-if="uprs.mode_of_procurement != 'public_bidding'">{{uprs.ntp_days}} <strong class="red" tooltip="Delay" v-if="uprs.ntp_days > 1">({{uprs.ntp_days - 1}})</strong></td>
              <td v-if="uprs.mode_of_procurement == 'public_bidding'">7</td>
              <td v-if="uprs.mode_of_procurement == 'public_bidding'">{{uprs.ntp_days}} <strong class="red" tooltip="Delay" v-if="uprs.ntp_days > 7">({{uprs.ntp_days - 7}})</strong></td>

              <td>{{uprs.ntp_remarks}}</td>
              <td>{{uprs.ntp_action}}</td>
              <td>
              </td>
            </tr>
            <tr>
              <td>NTP Received</td>
              <td>{{uprs.ntp_award_date}}</td>
              <td>1</td>
              <td>{{uprs.ntp_accepted_days}} <strong class="red" tooltip="Delay" v-if="uprs.ntp_accepted_days > 1">({{uprs.ntp_accepted_days - 1}})</strong></td>
              <td>{{uprs.ntp_accepted_remarks}}</td>
              <td>{{uprs.ntp_accepted_action}}</td>
              <td>
              </td>
            </tr>
            <tr>
              <td>Receive Delivery</td>
              <td>{{uprs.delivery_date}}</td>
              <td>{{uprs.delivery_terms}}</td>
              <td>{{uprs.dr_delivery_days}} <strong class="red" tooltip="Delay" v-if="uprs.dr_delivery_days > uprs.delivery_terms">({{uprs.dr_delivery_days - uprs.delivery_terms}})</strong></td>
              <td>{{uprs.dr_delivery_remarks}}</td>
              <td>{{uprs.dr_delivery_action}}</td>
              <td>
              </td>
            </tr>
            <tr>
              <td>COA Delivery</td>
              <td>{{uprs.dr_coa_date}}</td>
              <td>1</td>
              <td>{{uprs.dr_delivery_days}} <strong class="red" tooltip="Delay" v-if="uprs.dr_delivery_days > 1">({{uprs.dr_delivery_days - 1}})</strong></td>
              <td>{{uprs.dr_dr_coa_remarks}}</td>
              <td>{{uprs.dr_dr_coa_action}}</td>
              <td>
              </td>
            </tr>
            <tr>
              <td>Technical Inspection</td>
              <td>{{uprs.dr_inspection}}</td>
              <td>2</td>
              <td>{{uprs.tiac_days}} <strong class="red" tooltip="Delay" v-if="uprs.tiac_days > 2">({{uprs.tiac_days - 2}})</strong></td>
              <td>{{uprs.tiac_remarks}}</td>
              <td>{{uprs.tiac_action}}</td>
              <td>
              </td>
            </tr>
            <tr>
              <td>IAR Acceptance</td>
              <td>{{uprs.iar_accepted_date}}</td>
              <td>2</td>
              <td>{{uprs.tiac_accept_days}} <strong class="red" tooltip="Delay" v-if="uprs.tiac_accept_days > 2">({{uprs.tiac_accept_days - 2}})</strong></td>
              <td>{{uprs.tiac_accept_remarks}}</td>
              <td>{{uprs.tiac_accept_action}}</td>
              <td>
              </td>
            </tr>
            <tr>
              <td>DR Inspection Start</td>
              <td>{{uprs.di_start}}</td>
              <td>1</td>
              <td>{{uprs.diir_days}} <strong class="red" tooltip="Delay" v-if="uprs.diir_days > 1">({{uprs.diir_days - 1}})</strong></td>
              <td>{{uprs.diir_remarks}}</td>
              <td>{{uprs.diir_action}}</td>
              <td>
              </td>
            </tr>
            <tr>
              <td>DR Inspection Close</td>
              <td>{{uprs.di_close}}</td>
              <td>1</td>
              <td>{{uprs.diir_close_days}} <strong class="red" tooltip="Delay" v-if="uprs.diir_close_days > 1">({{uprs.diir_close_days - 1}})</strong></td>
              <td>{{uprs.diir_close_remarks}}</td>
              <td>{{uprs.diir_close_action}}</td>
              <td>
              </td>
            </tr>
            <tr>
              <td>Prepare Voucher</td>
              <td>{{uprs.v_transaction_date}}</td>
              <td>1</td>
              <td>{{uprs.vou_days}} <strong class="red" tooltip="Delay" v-if="uprs.vou_days > 1">({{uprs.vou_days - 1}})</strong></td>
              <td>{{uprs.vou_remarks}}</td>
              <td>{{uprs.vou_action}}</td>
              <td>
              </td>
            </tr>
            <tr>
              <td>Voucher Preaudit</td>
              <td>{{uprs.vou_preaudit_date}}</td>
              <td>2</td>
              <td>{{uprs.vou_preaudit_days}} <strong class="red" tooltip="Delay" v-if="uprs.vou_preaudit_days > 2">({{uprs.vou_preaudit_days - 2}})</strong></td>
              <td>{{uprs.vou_preaudit_remarks}}</td>
              <td>{{uprs.vou_preaudit_action}}</td>
              <td>
              </td>
            </tr>
            <tr>
              <td>Voucher Certify</td>
              <td>{{uprs.certify_date}}</td>
              <td>1</td>
              <td>{{uprs.vou_certify_days}} <strong class="red" tooltip="Delay" v-if="uprs.vou_certify_days > 1">({{uprs.vou_certify_days - 1}})</strong></td>
              <td>{{uprs.vou_certify_remarks}}</td>
              <td>{{uprs.vou_certify_action}}</td>
              <td>
              </td>
            </tr>
            <tr>
              <td>Voucher JEV</td>
              <td>{{uprs.journal_entry_date}}</td>
              <td>1</td>
              <td>{{uprs.vou_jev_days}} <strong class="red" tooltip="Delay" v-if="uprs.vou_jev_days > 1">({{uprs.vou_jev_days - 1}})</strong></td>
              <td>{{uprs.vou_jev_remarks}}</td>
              <td>{{uprs.vou_jev_action}}</td>
              <td>
              </td>
            </tr>
            <tr>
              <td>Voucher Approval</td>
              <td>{{uprs.vou_approval_date}}</td>
              <td>1</td>
              <td>{{uprs.vou_approved_days}} <strong class="red" tooltip="Delay" v-if="uprs.vou_approved_days > 1">({{uprs.vou_approved_days - 1}})</strong></td>
              <td>{{uprs.vou_approved_remarks}}</td>
              <td>{{uprs.vou_approved_action}}</td>
              <td>
              </td>
            </tr>
            <tr>
              <td>Voucher Release</td>
              <td>{{uprs.vou_approval_date}}</td>
              <td>1</td>
              <td>{{uprs.vou_released_days}} <strong class="red" tooltip="Delay" v-if="uprs.vou_released_days > 1">({{uprs.vou_released_days - 1}})</strong></td>
              <td>{{uprs.vou_released_remarks}}</td>
              <td>{{uprs.vou_released_action}}</td>
              <td>
              </td>
            </tr>
            <tr>
              <td>Voucher Received</td>
              <td>{{uprs.vou_received}}</td>
              <td>1</td>
              <td>{{uprs.vou_received_days}} <strong class="red" tooltip="Delay" v-if="uprs.vou_received_days > 1">({{uprs.vou_received_days - 1}})</strong></td>
              <td>{{uprs.vou_received_remarks}}</td>
              <td>{{uprs.vou_received_action}}</td>
              <td>
              </td>
            </tr>
            <tr>
              <td>Total</td>
              <td></td>
              <td>Working Days</td>
              <td>{{total}}</td>
            </tr>
          </tbody>
        </table>


      </div>
    </div>

  </div>
</template>

<script>
  import auth from '../../../api/auth.js'
  import TopBar from '../../LandingPage/TopBar'
  import SideBar from '../../LandingPage/SideBar'
  import UprButton from '../../ProcurementPage/UPR/Buttons'
  import JsonExcel from '../../ProcurementPage/UPR/JsonExcel'
  import { mapGetters, mapActions } from 'vuex'
  const moment = require('moment')

  export default {
    name: 'upr-timelines-page',
    components: { TopBar, SideBar, UprButton, JsonExcel },
    methods: {
      ...mapActions([
        'getUprTimeline'
      ])
    },
    mounted: function () {
      this.$nextTick(function () {
        auth.check()
      })
      this.getUprTimeline(this.$route.query.uprId)
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
        pagination: {
          total: 0,
          per_page: 1,
          from: 1,
          to: 0,
          current_page: 1
        },
        offset: 0,
        pageTitle: 'UPR Timeline'
      }
    },
    computed: {
      ...mapGetters([
        'uprs',
        'signatories'
      ]),
      total : function () {
        var startDate = moment(this.uprs.date_prepared)
        var endDate = moment(this.uprs.preaudit_date)
        return endDate.diff(startDate, 'days')
      },
      json_data: function () {
        return [
        ]
      }
    }
  }
</script>
