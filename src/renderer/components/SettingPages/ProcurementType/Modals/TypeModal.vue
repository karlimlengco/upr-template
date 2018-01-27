<template>
<div>
  <div class="modal" id="new-ptype-modal" style="z-index:999999999; left:0; top:0; right:0; bottom:0">
    <div class="modal__dialogue modal__dialogue--round-corner">
      <button type="button" class="modal__close-button">
          <i class="nc-icon-outline ui-1_simple-remove"></i>
      </button>
      <div class="moda__dialogue__head">
          <h1 class="modal__title">New Procurement Type</h1>
      </div>
      <div class="modal__dialogue__body">
        <div class="row">
          <div class="six columns">
              <div class="form-group">
                <label for="" class="label">Name</label>
                <input type="text" class="input" v-validate="'required'" name="code" v-model="model.code" >
                <span class="help-text" v-show="errors.has('code')">{{ errors.first('code') }}</span>
              </div>
          </div>
          <div class="six columns">
              <div class="form-group">
                <label for="" class="label">Description</label>
                <input type="text" class="input" v-validate="'required'" name="description" v-model="model.description" >
                <span class="help-text" v-show="errors.has('description')">{{ errors.first('description') }}</span>
              </div>
          </div>
        </div>

        <input name="_method" type="hidden" value="POST">
      </div>
      <div class="modal__dialogue__foot">
        <button type="button" class="button pull-left" @click.prevent="closeModal">Cancel</button>
        <button class="button" @click.prevent="saveForm">Proceed</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
  import { mapActions } from 'vuex'
  const uuidv1 = require('uuid/v1')
  const moment = require('moment')

  export default {
    props: [],
    mounted : function () {
    },
    data () {
      return {
        name: 'new-ptype-modal',
        poItem: [],
        model: {
          id : null,
          code : null,
          description : null,
          is_sync : null,
          created_at: moment().format("Y-MM-DD H:mm:ss")
        }
      }
    },
    methods: {
      ...mapActions([
        'createProcurementType'
      ]),
      saveForm () {
        this.$validator.validateAll()

        if (!this.errors.any() ) {
          this.model.id = uuidv1()
          this.createProcurementType(this.model)

          this.$root.$children[0].showNoti = true

          $('#new-ptype-modal').removeClass('is-visible')
        }
      }
    }
  }
</script>

<style>
  .input-wrapper{
      border: 1px solid transparent!important;
      border-radius: 0px!important;
      vertical-align: middle;
      display: flex;
      justify-content: space-between;
      flex-flow: row nowrap;
      align-items: center;
      padding: 0 15px 0 0!important;
      height:44px!important;
      box-sizing: border-box;
  }
  .input-wrapper .input{
    border: none!important;
  }
</style>