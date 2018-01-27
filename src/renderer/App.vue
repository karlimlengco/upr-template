<template>
  <div id="app">
    <router-view></router-view>

    <!-- <canvas id="the-canvas" style="border:1px solid black;"/> -->

    <div class="loader-container" v-if="loading" >

      <sync-loader :loading="loading" :color="color" :size="size"></sync-loader>
      <p>Loading Please wait...</p>
    </div>

    <div :class="ifShow" >
        <!-- <a href="" class="notifier__close-button"><i class="nc-icon-mini ui-1_simple-remove"></i></a> -->
        <h1 class="notifier__title">Success</h1>
        <p class="notifier__message"></p>
        <div class="notifier__utility">
            <a href="#" @click.prevent="closeNotification" class="notifier__utility__item ">Okay</a>
        </div>
    </div>

    <div v-if="onlinePassword" class="modal" id="password-sync-modal" style="z-index:88888888; left:0; top:0; right:0; bottom:0">
      <div class="modal__dialogue modal__dialogue--round-corner">
        <div class="moda__dialogue__head">
          <h1 class="modal__title">Connect to Server</h1>
        </div>

        <div class="modal__dialogue__body">
          <div class="row">
            <div class="twelve columns">
              <label for="" class="label">Username</label>
              <input type="text" class="input" v-validate="'required'" name="login" v-model="login" >
              <span class="help-text" v-show="errors.has('login')">{{ errors.first('login') }}</span>
            </div>
          </div>
          <div class="row">
            <div class="twelve columns">
              <label for="" class="label"> Password</label>
              <input type="password" class="input" v-validate="'required'" name="password" v-model="password" >
              <span class="help-text" v-show="errors.has('password')">{{ errors.first('password') }}</span>
            </div>
          </div>

        </div>

        <div class="modal__dialogue__foot">
            <button @click.prevent="saveForm" class="button">Proceed</button>
        </div>

      </div>
    </div>

    <div :class="ifShowError" >
        <!-- <a href="" class="notifier__close-button"><i class="nc-icon-mini ui-1_simple-remove"></i></a> -->
        <h1 class="notifier__title">Error</h1>
        <p class="notifier__message">{{showNotiErrorMsg}}</p>
        <div class="notifier__utility">
            <a href="#" v-if="onlinePassword"  @click.prevent="enterPassword" class="notifier__utility__item ">Okay</a>
            <a href="#" @click.prevent="closeNotification" class="notifier__utility__item ">Close</a>
        </div>
    </div>
  </div>
</template>

<script>
  import store from './store'
  import auth from './api/auth.js'
  import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
  // import PdfJs from 'pdfjs-dist'
  // import PdfJsWorker from 'pdfjs-dist/build/pdf.worker'
  // var fs = require('fs');
  // const path = require('path')

  export default {
    data () {
      return {
        color: '#5dc596',
        size: '35px',
        loading: false,
        showNoti: false,
        showNotiError: false,
        onlinePassword: false,
        showNotiErrorMsg: "",
        login: null,
        password: null
      }
    },
    mounted: function () {
      // setInterval(function () {
        // const filepath = path.resolve('src/helloworld.pdf')
        // var data = new Uint8Array(fs.readFileSync(filepath));
        // PDFJS.workerSrc = PdfJsWorker
        // PDFJS.workerSrc = '/node_modules/pdfjs-dist/build/pdf.worker.js';
        // PDFJS.disableWorker = true;
          // PDFJS.getDocument(data).then(function getPdfHelloWorld(pdf) {
          //     //
          //     // Fetch the first page
          //     console.log('first')
          //     //
          //     pdf.getPage(1).then(function getPageHelloWorld(page) {
          //       var scale = 1.5;
          //       var viewport = page.getViewport(scale);

          //       console.log('canvass')
          //       //
          //       // Prepare canvas using PDF page dimensions
          //       //
          //       var canvas = document.getElementById('the-canvas');
          //       var context = canvas.getContext('2d');
          //       canvas.height = viewport.height;
          //       canvas.width = viewport.width;

          //       //
          //       // Render PDF page into canvas context
          //       console.log('render')
          //       //
          //       page.render({canvasContext: context, viewport: viewport});
          //     });
          //   });
        // PDFJS.getDocument(data).then(function (pdfDocument) {
        //   console.log('Number of pages: ' + pdfDocument.numPages);
        // });

      // }.bind(this), 1500)
    },
    methods: {
      closeNotification () {
        this.showNoti = false
        this.showNotiError = false
        this.onlinePassword = false
      },
      testing(){
        this.$emit('test', {
            test: true,
        })
      },
      enterPassword () {
        $('#password-sync-modal').addClass('is-visible')
      },
      saveForm () {
        auth.signin(this, this.login, this.password, this)
        this.showNotiError = false
        $('#password-sync-modal').removeClass('is-visible')
      }
    },
    computed: {
      ifShow: function () {
        var newClass = "notifier notifier--success is-visible"
        if (this.showNoti == false) {
          return "notifier notifier--success"
        }
        return newClass
      },
      ifShowError: function () {
        var newClass = "notifier notifier--error is-visible"
        if (this.showNotiError == false) {
          return "notifier notifier--error"
        }
        return newClass
      }
    },
    components: { SyncLoader},
    store,
    name: 'appmis'
  }
</script>

<style>
  /* CSS */
  .loader-container{
    margin:0 auto;
    top:0;
    position: fixed;
    width: 100%;
    height: 100%;
    left:0;
    bottom:0;
    right:0;
    z-index:9999999;
    text-align:center;
    background-color: #eee;
    opacity: .5

  }
  .loader-container > .v-spinner{
    margin:0 auto;
    position: fixed;
    width: 100%;
    height: 100%;
    top:50%;
  }
   .loader-container > p {
    margin:0 auto;
    position: fixed;
    width: 100%;
    height: 100%;
    top:55%;
   }
</style>
