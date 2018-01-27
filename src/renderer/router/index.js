import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/viewPdf',
      name: 'view-pdf',
      component: require('@/components/PdfViewer')
    },
    {
      path: '/',
      name: 'login-page',
      component: require('@/components/LoginPage')
    },
    {
      path: '/upr-list-page',
      name: 'upr-list-page',
      component: require('@/components/ProcurementPage/UPR/UPRListPage')
    },
    {
      path: '/upr-form-page',
      name: 'upr-form-page',
      component: require('@/components/ProcurementPage/UPR/UPRFormPage')
    },
    {
      path: '/upr-edit-page',
      name: 'upr-edit-page',
      component: require('@/components/ProcurementPage/UPR/UPREditPage')
    },
    {
      path: '/upr-view-page',
      name: 'upr-view-page',
      component: require('@/components/ProcurementPage/UPR/UPRViewPage')
    },
    {
      path: '/signatory-list-page',
      name: 'signatory-list-page',
      component: require('@/components/SettingPages/Signatory/SignatoryListPage')
    },
    {
      path: '/signatory-form-page',
      name: 'signatory-form-page',
      component: require('@/components/SettingPages/Signatory/SignatoryFormPage')
    },
    {
      path: '/signatory-edit-page',
      name: 'signatory-edit-page',
      component: require('@/components/SettingPages/Signatory/SignatoryEditPage')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
