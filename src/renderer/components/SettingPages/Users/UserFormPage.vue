<template>
  <div class="container">
    <top-bar></top-bar>
    <side-bar></side-bar>

    <div class="content">
      <div class="content__wrapper">
        <form class="ui form addcatform" @submit.prevent="addUser">
          <div class="row">
            <div class="twelve columns align-left utility utility--align-right">
              <router-link to="user-list-page" class="button button--pull-left" ><i class="nc-icon-mini  arrows-1_tail-left"></i></router-link>
              <button type="submit" class="button" tooltip="Save"><i class="nc-icon-mini ui-2_disk"></i></button>
            </div>
          </div>

          <div class="row">
            <div class="four columns">
                <div class="form-group">
                  <label for="" class="label">First Name</label>
                  <input type="text" class="input" v-validate="'required'" name="first_name" v-model="model.first_name" >
                  <span class="help-text" v-show="errors.has('first_name')">{{ errors.first('first_name') }}</span>
                </div>
            </div>
            <div class="four columns">
                <div class="form-group">
                  <label for="" class="label">Middle Name</label>
                  <input type="text" class="input" v-validate="'required'" name="middle_name" v-model="model.middle_name" >
                  <span class="help-text" v-show="errors.has('middle_name')">{{ errors.first('middle_name') }}</span>
                </div>
            </div>
            <div class="four columns">
                <div class="form-group">
                  <label for="" class="label">Last Name</label>
                  <input type="text" class="input" v-validate="'required'" name="surname" v-model="model.surname" >
                  <span class="help-text" v-show="errors.has('surname')">{{ errors.first('surname') }}</span>
                </div>
            </div>
          </div>

          <div class="row">
              <div class="four columns">
                  <div class="form-group">
                    <label for="" class="label">Username</label>
                    <input type="text" class="input" v-validate="'required'" name="username" v-model="model.username" >
                    <span class="help-text" v-show="errors.has('username')">{{ errors.first('username') }}</span>
                  </div>
              </div>
              <div class="four columns">
                  <div class="form-group">
                    <label for="" class="label">Password</label>
                    <input type="password" class="input" v-validate="'required'" name="password" v-model="model.password" >
                    <span class="help-text" v-show="errors.has('password')">{{ errors.first('password') }}</span>
                  </div>
              </div>
              <div class="four columns">
                  <div class="form-group">
                    <label for="" class="label">Confirm Password</label>
                    <input type="password" class="input" v-validate="'required'" name="password_confirmation" >
                    <span class="help-text" v-show="errors.has('password_confirmation')">{{ errors.first('password_confirmation') }}</span>
                  </div>
              </div>
          </div>

          <div class="row">
              <div class="four columns">
                  <div class="form-group">
                    <label for="" class="label">Catered Unit</label>
                    <!-- <input type="text" class="input" v-validate="'required'" name="unit_id" v-model="model.unit_id" > -->

                    <selectize v-validate="'required'" name="gender" v-model="model.unit_id"> <!-- settings is optional -->
                      <option value=''>Select One</option>
                      <option v-for="option in units" v-bind:value="option.id">
                        {{ option.short_code }}
                      </option>
                    </selectize>
                    <span class="help-text" v-show="errors.has('unit_id')">{{ errors.first('unit_id') }}</span>
                  </div>
              </div>
              <div class="four columns">
                  <div class="form-group">
                    <label for="" class="label">Designation</label>
                    <input type="text" class="input" v-validate="'required'" name="designation" v-model="model.designation" >
                    <span class="help-text" v-show="errors.has('designation')">{{ errors.first('designation') }}</span>
                  </div>
              </div>
              <div class="four columns">
                  <div class="form-group">
                    <label for="" class="label">Email</label>
                    <input type="text" class="input" v-validate="'required'" name="email" v-model="model.email" >
                    <span class="help-text" v-show="errors.has('email')">{{ errors.first('email') }}</span>
                  </div>
              </div>
          </div>

          <div class="row">
              <div class="six columns">
                  <div class="form-group">
                    <label for="" class="label">Contact Number</label>
                    <input type="text" class="input" v-validate="'required'" name="contact_number" v-model="model.contact_number" >
                    <span class="help-text" v-show="errors.has('contact_number')">{{ errors.first('contact_number') }}</span>
                  </div>
              </div>
              <div class="six columns">
                  <div class="form-group">
                    <label for="" class="label">Gender</label>
                    <selectize v-validate="'required'" name="gender" v-model="model.gender"> <!-- settings is optional -->
                      <option value=''>Select One</option>
                      <option value='male'>Male</option>
                      <option value='female'>Female</option>
                    </selectize>
                    <!-- <input type="text" class="input" v-validate="'required'" name="gender" v-model="model.gender" > -->
                    <span class="help-text" v-show="errors.has('gender')">{{ errors.first('gender') }}</span>
                  </div>
              </div>
          </div>

          <div class="row">
              <div class="twelve columns">
                  <div class="form-group">
                    <label for="" class="label">Address</label>
                    <textarea class="textarea" v-validate="'required'" name="address" v-model="model.address"></textarea>
                    <span class="help-text" v-show="errors.has('address')">{{ errors.first('address') }}</span>
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

  var bcrypt = require('bcryptjs');
  var salt = bcrypt.genSaltSync(10);

  export default {
    name: 'user-list-page',
    components: { TopBar, SideBar, Selectize },
    methods: {
      ...mapActions([
        'createUser',
        'dropdownUnits'
      ]),
      addUser () {
        this.$validator.validateAll()
        this.model.uuid = this.id
        var hash = bcrypt.hashSync(this.model.password, salt);
        this.model.password = hash

        if (!this.errors.any()) {
          this.createUser(this.model)

          this.$root.$children[0].showNoti = true
          this.$router.push({
            path: 'user-list-page'
          })
        }
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        auth.check()
      })
      this.id = uuidv1()
      this.dropdownUnits()
    },
    data () {
      return {
        offset: 4,
        id: -1,
        model: {
          first_name: '',
          uuid: '',
          middle_name: '',
          surname: '',
          username: '',
          password: '',
          unit_id: '',
          designation: '',
          email: '',
          contact_number: '',
          gender: '',
          address: ''
        },
        pageTitle: 'Users'
      }
    },
    computed: {
      ...mapGetters([
        'users',
        'units'
      ])
    }
  }
</script>
