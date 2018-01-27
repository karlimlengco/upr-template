<template>
  <!-- sidebar -->
  <div class="sidebar">
      <a href="#" class="sidebar__toggle-button"></a>

      <!-- logo -->
      <div class="sidebar__logo">
          <!-- <h1 class="sidebar__logo__type">Logo</h1> -->
          <span class="sidebar__logo__icon"><img src="static/assets/img/logo.png" alt=""></span>
      </div>

      <!-- search -->
      <div class="sidebar__search">
          <input type="text" class="sidebar__search__input" v-model="searchText" @keyup.enter="searching" placeholder="Looking for something?">
          <button class="sidebar__search__button"><i class="nc-icon-mini ui-1_zoom"></i></button>
      </div>

      <!-- menu -->
      <ul class="sidebar__menu">
          <li class="sidebar__menu__item" >
            <router-link to="upr-list-page" class="sidebar__menu__item__link" ><i class="nc-icon-mini design_window-paragraph"></i>Draft UPR</router-link>
          </li>
          
          <li class="sidebar__child-menu__item">
              <router-link to="signatory-list-page" class="sidebar__child-menu__item__link" >Signatories</router-link>
          </li>
      </ul>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  export default {
    data () {
      return {
        name: 'landing-page',
        searchText:""
      }
    },
    mounted: function () {
      $(".sidebar").mCustomScrollbar({
          axis:"y",
          setTop:0,
          scrollbarPosition:"inside",
          scrollInertia:250,
          autoDraggerLength:true,
          autoHideScrollbar:true,
          alwaysShowScrollbar:0,
          contentTouchScroll:25,
          theme:"minimal-dark"
      });
      $(".table-scroll").mCustomScrollbar({
          axis:"x",
          setLeft:0,
          scrollbarPosition:"inside",
          scrollInertia:250,
          autoDraggerLength:true,
          autoHideScrollbar:true,
          alwaysShowScrollbar:0,
          contentTouchScroll:25,
          theme:"minimal-dark"
      });

      $(".chat__thread").mCustomScrollbar({
          axis:"y",
          setTop:"-999999999px",
          scrollbarPosition:"inside",
          scrollInertia:250,
          autoDraggerLength:true,
          autoHideScrollbar:true,
          alwaysShowScrollbar:0,
          contentTouchScroll:25,
          theme:"minimal-dark"
      });
    },
    methods: {
      ...mapActions([
        'getCurrentUser',
        'getUserPermission'
      ]),
      searching(){
        this.$emit('searchingText', {
            searchText: this.searchText,
        })
      },
      hasPermission (route) {

        for (var key in this.userPermissions) {
          var permissions = JSON.parse(this.userPermissions[key].permissions)
          for (var key2 in permissions) {
            if (key2.indexOf(route) !== -1) {
              return true
            }
          }
        }
        return false
      }
    },
    computed: {
      ...mapGetters([
        'currentUser',
        'userPermissions'
      ])
    }
  }
</script>
