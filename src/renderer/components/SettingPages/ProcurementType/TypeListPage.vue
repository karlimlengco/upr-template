<template>
  <div class="container">
    <top-bar></top-bar>
    <side-bar></side-bar>

    <div class="content">
      <div class="content__wrapper">



        <div class="row">
          <div class="six columns align-left">
            <h3></h3>
          </div>
          <div class="six columns utility utility--align-right" >
            <router-link to="type-form-page" class="button" ><i class="nc-icon-mini ui-1_circle-add"></i></router-link>
          </div>
        </div>

        <table class="table table--with-border">
          <thead>
            <tr>
              <th>SYNC</th>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, index) in procurementTypes.data">
                <tr >
                    <td>{{item.is_sync}}</td>
                    <td>{{item.code}}</td>
                    <td>{{item.description}}</td>
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
    name: 'type-list-page',
    components: { TopBar, SideBar },
    methods: {
      ...mapActions([
        'listProcurementTypes'
      ])
    },
    mounted: function () {
      this.$nextTick(function () {
        auth.check()
      })
      this.listProcurementTypes(this.offset)
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
        pageTitle: 'Procurement Type'
      }
    },
    computed: {
      ...mapGetters([
        'procurementTypes'
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
