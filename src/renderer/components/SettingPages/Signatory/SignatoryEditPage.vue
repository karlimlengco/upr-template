<template>
  <div class="container">
    <top-bar></top-bar>
    <side-bar></side-bar>

    <div class="modal" id="delete-modal" style="z-index:999999999; left:0; top:0; right:0; bottom:0">
      <div class="modal__dialogue modal__dialogue--round-corner">
        <button type="button" class="modal__close-button">
            <i class="nc-icon-outline ui-1_simple-remove"></i>
        </button>
        <div class="moda__dialogue__head">
            <h1 class="modal__title">Delete Confirmation</h1>
        </div>
        <div class="row">
          <div class="twelve columns">
            
          </div>
        </div>
        <div class="modal__dialogue__body">
          <input name="_method" type="hidden" value="POST">
        </div>
        <div class="modal__dialogue__foot">
          <button class="button" @click.prevent="deleteItem()">Proceed</button>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="content__wrapper">
        <form class="ui form addcatform" @submit.prevent="addSignatory">
          <div class="row">
            <div class="twelve columns align-left utility utility--align-right">
              <router-link to="signatory-list-page" class="button button--pull-left" ><i class="nc-icon-mini  arrows-1_tail-left"></i></router-link>
              <button type="submit" class="button" tooltip="Save"><i class="nc-icon-mini ui-2_disk"></i></button>
              <button @click.prevent="deleteModal()" class="button" tooltip="Delete">X</button>
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
        'deleteSignatory',
        'updateSignatory',
        'serverSignatoryPush'
      ]),
      deleteModal(){
        $('#delete-modal').addClass('is-visible')
      },
      deleteItem(){
        this.deleteSignatory(this.model.id).then(response => {
          this.$root.$children[0].showNoti = true
          $('#delete-modal').removeClass('is-visible')
          this.$router.push({ path: 'signatory-list-page'})
        })
      },
      addSignatory () {
        this.$validator.validateAll()
        this.model.is_sync = null
        if (!this.errors.any()) {
          this.updateSignatory([this.model.id, this.model])
          this.$root.$children[0].showNoti = true
          this.serverSignatoryPush()
          this.$router.push({
            path: 'signatory-list-page'
          })
        }
      }
    },
    created (){
        this.model = Object.assign({}, this.$route.query.sigDetails);
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
