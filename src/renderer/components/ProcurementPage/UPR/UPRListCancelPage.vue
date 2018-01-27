<template>
  <div class="container">
    <top-bar></top-bar>
    <side-bar @searchingText="searchVal"></side-bar>

    <div class="content">
      <div class="content__wrapper">



        <div class="row">
          <div class="six columns align-left">
            <h3></h3>
          </div>
          <div class="six columns align-right" >
          </div>
        </div>
        <br>
        <h3><span style="border-bottom:2px solid black">List of Cancelled Unit Purchase Requests(UPRs)</span></h3>

        <table class="table table--with-border">
          <thead>
            <tr>
              <th>PCCO</th>
              <th>UPR #</th>
              <th>REF #</th>
              <th>ABC</th>
              <th>Approved Contact</th>
              <th>Residual</th>
              <th>Status</th>
              <th>Date Prepared</th>
              <th>Due Date</th>
              <th>Justification</th>
              <th>Action Taken</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in uprs.data">
                <tr >
                    <td> {{item.centers}}</td>
                    <td><router-link :to="{ path: 'upr-view-page', query: { uprId: item.id  }}">{{item.upr_number}}</router-link></td>
                    <td> {{item.ref_number}}</td>
                    <td> {{item.total_amount}}</td>
                    <td> {{item.bid_amount}}</td>
                    <td> {{item.total_amount - item.bid_amount}}</td>
                    <td> {{item.status}}</td>
                    <td> {{item.date_prepared}}</td>
                    <td> {{item.next_due}}</td>
                    <td> {{item.last_remarks}}</td>
                    <td> {{item.last_action}}</td>
                </tr>
            </template>
          </tbody>
        </table>
        <div class="pagination">

          <div class="pagination__list pagination__list--solid">
            <a href=""
              v-bind:class="[ pagination.current_page > 1 ? 'pagination__list__item' : 'pagination__list__item pagination__list__item--disabled']"
              @click.prevent="changePage(pagination.current_page - 1)">
              <i class="nc-icon-outline arrows-1_tail-left"></i>
            </a>
            <template v-for="page in pagesNumber">
              <a href="#" @click.prevent="changePage(page)"  v-bind:class="[ page == isActived ? 'pagination__list__item pagination__list__item--active' : 'pagination__list__item']">{{page}}</a>
            </template>
            <a href=""
              v-bind:class="[ pagination.current_page < pagination.last_page ? 'pagination__list__item' : 'pagination__list__item pagination__list__item--disabled']"
              @click.prevent="changePage(pagination.current_page + 1)">
              <i class="nc-icon-outline arrows-1_tail-right"></i>
            </a>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
  import auth from '../../../api/auth.js'
  import TopBar from '../../LandingPage/TopBar'
  import SideBar from '../../LandingPage/SideBar'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'upr-cancelled-list-page',
    components: { TopBar, SideBar },
    methods: {
      ...mapActions([
        'listCancelledUprs',
        'listBidCancelledUprs'
      ]),
      searchVal(msg) {
        if ( this.$route.query.pType != 'bidding') {
          this.listCancelledUprs([this.offset, msg.searchText])
        } else {
          this.listBidCancelledUprs([this.offset, msg.searchText])
        }
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        auth.check()
      })
      if ( this.$route.query.pType != 'bidding') {
        this.listCancelledUprs([this.offset])
      } else {
        this.listBidCancelledUprs([this.offset])
      }

    },
    data () {
      return {
        pagination: {
          total: 0,
          per_page: 1,
          from: 1,
          to: 0,
          current_page: 1
        },
        offset: 0,
        pageTitle: 'Unit Purchase Request (Cancelled)'
      }
    },
    computed: {
      ...mapGetters([
        'accountCodes',
        'uprs'
      ]),
      pagesNumber: function () {
        if (!this.pagination.to) {
          return []
        }
        var from = this.pagination.current_page - this.offset
        if (from < 1) {
          from = 1
        }
        var to = from + (this.offset * 2)
        if (to >= this.pagination.last_page) {
          to = this.pagination.last_page
        }
        var pagesArray = []
        while (from <= to) {
          pagesArray.push(from)
          from++
        }
        return pagesArray
      }
    }
  }
</script>
