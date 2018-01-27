<template>
  <div class="container">
    <top-bar></top-bar>
    <side-bar></side-bar>

    <div class="content">
      <div class="content__wrapper">
        <form class="ui form addcatform" @submit.prevent="addPermission">
          <div class="row">
            <div class="twelve columns align-left utility utility--align-right">
              <router-link to="pcco-list-page" class="button button--pull-left" ><i class="nc-icon-mini  arrows-1_tail-left"></i></router-link>
              <button type="submit" class="button" tooltip="Save"><i class="nc-icon-mini ui-2_disk"></i></button>
            </div>
          </div>

          <div class="row">
            <div class="six columns">
                <div class="form-group">
                  <label for="" class="label">Name</label>
                  <input type="text" class="input" v-validate="'required'" name="name" v-model="model.name" >
                  <span class="help-text" v-show="errors.has('name')">{{ errors.first('name') }}</span>
                </div>
            </div>
            <div class="six columns">
                <div class="form-group">
                  <label for="" class="label">Short Code</label>
                  <input type="text" class="input" v-validate="'required'" name="short_code" v-model="model.short_code" >
                  <span class="help-text" v-show="errors.has('short_code')">{{ errors.first('short_code') }}</span>
                </div>
            </div>
          </div>

          <div class="row">
            <div class="six columns">
                <div class="form-group">
                  <label for="" class="label">Address</label>
                  <input type="text" class="input" v-validate="'required'" name="address" v-model="model.address" >
                  <span class="help-text" v-show="errors.has('address')">{{ errors.first('address') }}</span>
                </div>
            </div>
            <div class="six columns">
                <div class="form-group">
                  <label for="" class="label">Programs</label>
                  <select class="input" v-validate="'required'" name="programs" v-model="model.programs" >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                  <span class="help-text" v-show="errors.has('programs')">{{ errors.first('programs') }}</span>
                </div>
            </div>
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
  const uuidv1 = require('uuid/v1')
  const moment = require('moment')


  export default {
    name: 'pcco-list-page',
    components: { TopBar, SideBar},
    methods: {
      ...mapActions([
        'createProcurement'
      ]),
      addPermission () {
        this.$validator.validateAll()
        this.model.id = this.id

        if (!this.errors.any()) {
          this.createProcurement(this.model)
          this.$root.$children[0].showNoti = true
          this.$router.push({
            path: 'pcco-list-page'
          })
        }
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        auth.check()
      })
      this.id = uuidv1()
    },
    data () {
      return {
        offset: 4,
        id: -1,
        model: {
          id: '',
          name: '',
          short_code: '',
          address: '',
          programs: '',
          created_at: moment().format("Y-MM-DD H:mm:ss")
        },
        pageTitle: 'PCCO'
      }
    },
    computed: {
      ...mapGetters([
        'procurementCenters'
      ])
    }
  }
</script>
