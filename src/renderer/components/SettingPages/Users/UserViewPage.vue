<template>
  <div class="container">
    <top-bar></top-bar>
    <side-bar></side-bar>

    <div class="content">
      <div class="content__wrapper">
      <form class="ui form addcatform" @submit.prevent="saveUser()">

      <div class="row">
          <div class="twelve columns align-left utility utility--align-right">
              <router-link :to="{ path: 'user-list-page'}" class="button button--pull-left" tooltip="Back">
                <i class="nc-icon-mini arrows-1_tail-left"></i>
              </router-link>

              <button type="submit" class="button" tooltip="Save" >
              <i class="nc-icon-mini ui-2_disk"></i>
              </button>

              <!-- <a href="#" class="button topbar__utility__button--modal" tooltip="Delete"><i class="nc-icon-mini ui-1_trash"></i></a> -->
          </div>
      </div>

      <div class="row">
        <div class="twelve columns">

          <div class="row">
            <h3>User Details</h3>
          </div>

          <div class="row">
            <div class="six columns">
              <div class="form-group">
                <label for="" class="label">Username</label>
                <input type="text" class="input" v-validate="'required'" name="username" v-model="model.username">
                <span class="help-text" v-show="errors.has('username')">{{ errors.first('username') }}</span>
              </div>
            </div>
            <div class="six columns">
                <div class="form-group">
                  <label for="" class="label">Email</label>
                  <input type="text" class="input" v-validate="'required'" name="email" v-model="model.email" >
                  <span class="help-text" v-show="errors.has('email')">{{ errors.first('email') }}</span>
                </div>
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
              <div class="six columns">
                  <div class="form-group">
                    <label for="" class="label">Catered Unit</label>
                    <selectize v-validate="'required'" name="unit_id" v-model="model.unit_id"> <!-- settings is optional -->
                      <option value=''>Select One</option>
                      <option v-for="option in units" v-bind:value="option.id">
                        {{ option.short_code }}
                      </option>
                    </selectize>
                    <span class="help-text" v-show="errors.has('unit_id')">{{ errors.first('unit_id') }}</span>
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
                      <option value='male'>Male</option>
                      <option value='female'>Female</option>
                    </selectize>
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

        </div>
      </div>
      <br>
      <div class="row">
        <div class="twelve columns">

          <div class="row">
            <h3>User Roles</h3>
          </div>

          <div class="row">
            <div class="twelve columns">
              <div class="form-group">
                <label for="" class="label">Roles</label>
                <selectize id="id_role_field" name="role" :value="getUserRole" :settings="roleSettings" >
                  <template v-for="role in roles" >
                    <option v-bind:value="role.id">
                      {{ role.name }}
                    </option>
                  </template>
                </selectize>
              </div>
            </div>
          </div>

        </div>
      </div>
      <br>
      <div class="row">
        <div class="twelve columns">

          <div class="row">
            <h3>Change Password</h3>
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
    name: 'user-view-page',
    components: { TopBar, SideBar, Selectize},
    methods: {
      ...mapActions([
        'getUserById',
        'dropdownRoles',
        'updateUser',
        'getRoleByUser',
        'updateUserRole',
        'dropdownUnits'
      ]),
      saveUser () {
        this.$validator.validateAll()
        this.model.id = this.$route.query.userId.id
        this.roleUser.role_id = $("#id_role_field").val()

        if (!this.errors.any()) {
          this.updateUser([this.model.id, this.model])
          this.updateUserRole(this.roleUser)

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
      this.dropdownRoles()
      this.getRoleByUser(this.$route.query.userId.id)
      this.getUserById(this.$route.query.userId.id)
    },
    data () {
      return {
        offset: 4,
        model: {
          first_name: this.$route.query.userId.first_name,
          middle_name: this.$route.query.userId.middle_name,
          surname: this.$route.query.userId.surname,
          username: this.$route.query.userId.username,
          password: null,
          unit_id: this.$route.query.userId.unit_id,
          designation: this.$route.query.userId.designation,
          email: this.$route.query.userId.email,
          contact_number: this.$route.query.userId.contact_number,
          gender: this.$route.query.userId.gender,
          address: this.$route.query.userId.address
        },
        roleUser: {
          role_id: null,
          user_id:this.$route.query.userId.id,
        },
        roleSettings: {
          maxItems: 5
        },
        pageTitle: 'Users'
      }
    },
    computed: {
      ...mapGetters([
        'users',
        'userRoles',
        'units',
        'roles'
      ]),
      getUserRole () {
        var values = []
        for (var key in this.userRoles) {
          values.push(this.userRoles[key].id)
        }
        return values
      }
    }
  }
</script>
