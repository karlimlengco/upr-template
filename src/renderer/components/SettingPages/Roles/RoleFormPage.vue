<template>
  <div class="container">
    <top-bar></top-bar>
    <side-bar></side-bar>

    <div class="content">
      <div class="content__wrapper">
        <form class="ui form addcatform" @submit.prevent="addRole">
          <div class="row">
            <div class="twelve columns align-left utility utility--align-right">
              <router-link to="role-list-page" class="button button--pull-left" ><i class="nc-icon-mini  arrows-1_tail-left"></i></router-link>
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
                  <label for="" class="label">Slug</label>
                  <input type="text" class="input" v-validate="'required'" name="slug" v-model="model.slug" >
                  <span class="help-text" v-show="errors.has('slug')">{{ errors.first('slug') }}</span>
                </div>
            </div>
          </div>

          <div class="row">
            <div class="twelve columns">
                <div class="form-group">
                  <label for="" class="label">Permissions</label>
                  <input type="text" class="input" v-validate="'required'" name="permissions" v-model="model.permissions" >
                  <span class="help-text" v-show="errors.has('permissions')">{{ errors.first('permissions') }}</span>
                </div>
            </div>
          </div>


          <div class="row">
            <div class="twelve columns">
                <div class="form-group">
                  <label for="" class="label">Description</label>
                  <input type="text" class="input" v-validate="'required'" name="description" v-model="model.description" >
                  <span class="help-text" v-show="errors.has('description')">{{ errors.first('description') }}</span>
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
  import Selectize from 'vue2-selectize'
  const uuidv1 = require('uuid/v1')
  const moment = require('moment')

  export default {
    name: 'role-list-page',
    components: { TopBar, SideBar, Selectize },
    methods: {
      ...mapActions([
        'createRole'
      ]),
      addRole () {
        this.$validator.validateAll()
        this.model.id = this.id

        if (!this.errors.any()) {
          this.createRole(this.model)
          this.$root.$children[0].showNoti = true
          this.$router.push({
            path: 'role-list-page'
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
          slug: '',
          name: '',
          permissions: '',
          description: '',
          created_at: moment().format("Y-MM-DD H:mm:ss")
        },
        pageTitle: 'Roles'
      }
    },
    computed: {
      ...mapGetters([
        'roles'
      ])
    }
  }
</script>
