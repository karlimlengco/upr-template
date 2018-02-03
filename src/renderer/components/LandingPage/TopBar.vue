<template>
  <div class="topbar">
    <div class="topbar__wrapper">
        <div class="topbar__left-panel">
            <h1 class="topbar__page-title">{{pageTitle}}</h1>
            <div class="topbar__breadcrumbs">
               <!--  <a href="#" class="topbar__breadcrumbs__item">Outworld Destroyer</a>
                <a href="#" class="topbar__breadcrumbs__item">Staff of Wizardy</a>
                <a href="#" class="topbar__breadcrumbs__item">Force Staff</a> -->
            </div>
        </div>
        <div class="topbar__right-panel">
            <div class="topbar__utility">
            <!--     <button class="topbar__utility__button topbar__utility__button--modal">
                    <span class="topbar__utility__button__badge">9+</span>
                    <i class="nc-icon-mini ui-1_bell-53"></i>
                </button> -->
<!--                             <button class="topbar__utility__button open-chat">
                    <span class="topbar__utility__button__badge">9+</span>
                    <i class="nc-icon-mini ui-2_chat-round"></i>
                </button> -->
             <!--    <button class="topbar__utility__button open-inbox">
                    <span class="topbar__utility__button__badge">9+</span>
                    <i class="nc-icon-mini ui-1_email-83"></i>
                </button> -->
            </div>
            <div class="topbar__user">
                <div class="topbar__user__info">
                    <span class="topbar__user__info__dept">END USER</span>
                    <span class="topbar__user__info__dept"><connectivity></connectivity></span>
                </div>
                <div class="topbar__user__avatar" v-if="currentUser != undefined && currentUser.first_name != undefined">
                    {{currentUser.first_name.substring(0,1)}} {{currentUser.surname.substring(0,1)}}
                </div>
                <ul class="topbar__user__options">
                    <li class="topbar__user__options__item">
                        <a href="#" v-on:click="signout" class="topbar__user__options__item__link">Logout</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>
</template>

<script>
  import router from '../../router'
  import { mapGetters, mapActions } from 'vuex'
  import Connectivity from './../Connectivity'

  export default {
    data () {
      return {
        name: 'landing-page',
        pageTitle: 'Dashboard',
        netStatus: 'Offline'
      }
    },
    components: { Connectivity },
    mounted: function () {
      this.pageTitle = this.$parent.pageTitle
      
    },
    methods: {
      ...mapActions([
        'getCurrentUser'
      ]),
      signout () {
        router.push({
          name: 'login-page'
        })
      }
    },
    computed: {
      ...mapGetters([
        'currentUser'
      ])
    }
  }
</script>
