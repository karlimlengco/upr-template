<template>
  <div class="container">
    <top-bar></top-bar>
    <side-bar @searchingText="searchVal"></side-bar>

    <div class="content">
      <div class="content__wrapper">

        <div class="row">
          <div class="twelve columns align-right" >
            <router-link :to="{ path: 'upr-form-page', query: { codes: accountCodes }  }" class="button" >Create UPR</router-link>
          </div>
        </div>
        <br>
        <h3><span style="border-bottom:2px solid black">List of Unit Purchase Requests(UPRs)</span></h3>

        <table class="table table--with-border">
          <thead>
            <tr>
              <th>UPR #</th>
              <th>REF #</th>
              <th>Projecet Name</th>
              <th>Place Of Delivery</th>
              <th>Date</th>
              <th>Type</th>
              <th>Mode</th>
              <th>chargeability</th>
              <th>fund_validity</th>
              <th>terms_of_payment</th>
              <th>purpose</th>
              <th>other_infos</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in uprs.data">
                <tr >
                    <td><router-link :to="{ path: 'upr-view-page', query: { uprId: item.id, codes: accountCodes  }}">{{item.upr_number}}</router-link></td>
                    <td>{{item.ref_number}}</td>
                    <td>{{item.project_name}}</td>
                    <td>{{item.place_of_delivery}}</td>
                    <td>{{item.date_prepared}}</td>
                    <td>{{item.type}}</td>
                    <td>{{item.modes}}</td>
                    <td>{{item.charge}}</td>
                    <td>{{item.fund_validity}}</td>
                    <td>{{item.terms}}</td>
                    <td>{{item.purpose}}</td>
                    <td>{{item.other_infos}}</td>
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
  import TopBar from '../../LandingPage/TopBar'
  import SideBar from '../../LandingPage/SideBar'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'upr-list-page',
    components: { TopBar, SideBar },
    methods: {
      ...mapActions([
        'dropdownAccounts',
        'listDraftUprs'
      ]),
      searchVal(msg) {
        this.listDraftUprs([this.offset, msg.searchText])
      }
    },
    mounted: function () {
      this.listDraftUprs([this.offset])
      this.dropdownAccounts()

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
        pageTitle: 'Unit Purchase Request'
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
