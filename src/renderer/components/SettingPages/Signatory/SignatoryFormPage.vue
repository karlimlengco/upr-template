<template>
  <div class="container">
    <top-bar></top-bar>
    <side-bar></side-bar>

    <div class="content">
      <div class="content__wrapper">
        <form class="ui form addcatform" @submit.prevent="addSignatory">
          <div class="row">
            <div class="twelve columns align-left utility utility--align-right">
              <router-link to="signatory-list-page" class="button button--pull-left" ><i class="nc-icon-mini  arrows-1_tail-left"></i></router-link>
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
                  <label for="" class="label">Ranks</label>
                  <input type="text" class="input" v-validate="'required'" name="ranks" v-model="model.ranks" >
                  <span class="help-text" v-show="errors.has('ranks')">{{ errors.first('ranks') }}</span>
                </div>
            </div>
          </div>

          <div class="row">
            <div class="six columns">
                <div class="form-group">
                  <label for="" class="label">Branch</label>
                  <input type="text" class="input" v-validate="'required'" name="branch" v-model="model.branch" >
                  <span class="help-text" v-show="errors.has('branch')">{{ errors.first('branch') }}</span>
                </div>
            </div>
            <div class="six columns">
                <div class="form-group">
                  <label for="" class="label">Designation</label>
                  <input type="text" class="input" v-validate="'required'" name="designation" v-model="model.designation" >
                  <span class="help-text" v-show="errors.has('designation')">{{ errors.first('designation') }}</span>
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
  import Selectize from 'vue2-selectize'
  const uuidv1 = require('uuid/v1')
  const moment = require('moment')

  export default {
    name: 'signatory-list-page',
    components: { TopBar, SideBar, Selectize },
    methods: {
      ...mapActions([
        'createSignatory'
      ]),
      addSignatory () {
        this.$validator.validateAll()
        this.model.id = this.id

        if (!this.errors.any()) {
          this.createSignatory(this.model)
          this.$root.$children[0].showNoti = true
          this.$router.push({
            path: 'signatory-list-page'
          })
        }
      }
    },
    mounted: function () {
      this.id = uuidv1()
    },
    data () {
      return {
        offset: 4,
        id: -1,
        model: {
          id: '',
          ranks: '',
          name: '',
          branch: '',
          designation: '',
          created_at: moment().format("Y-MM-DD H:mm:ss")
        },
        pageTitle: 'Signatories'
      }
    },
    computed: {
      ...mapGetters([
        'signatories'
      ])
    }
  }
</script>
