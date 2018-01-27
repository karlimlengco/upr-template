import axios from 'axios'
import router from '../router'
import { API_ROOT } from '../../config.js'
import { db } from '../../server/db.js'

export default {
  user: {
    authenticated: false,
    profile: null
  },
  check () {
    let token = localStorage.getItem('id_token')
    if (token !== null) {
      axios.get(
        API_ROOT + 'api/user?token=' + localStorage.getItem('id_token')
      ).then(response => {
        this.user.authenticated = true
        this.user.profile = response.data.data
      })
    }
  },
  signin (context, login, password, thisIs) {
    axios.post(API_ROOT + 'api/signin', {
      login: context.login,
      password: context.password
    }).then(response => {
      localStorage.setItem('id_token', response.data.meta.token)
      localStorage.setItem('user_id', response.data.data.name.id)
      localStorage.setItem('unit_id', response.data.data.name.unit_id)
      localStorage.setItem('user_password', context.password)
      context.user.authenticated = true
      context.user.profile = response.data.data
      router.push({
        name: 'landing-page'
      })
      this.$forceUpdate()
    }).catch(e => {
      thisIs.$root.$children[0].showNotiError = true
      thisIs.$root.$children[0].showNotiErrorMsg = "Please check your password"
    })
  },
  signout () {
    localStorage.removeItem('id_token')
    this.user.authenticated = false
    this.user.profile = null

    router.push({
      name: 'login-page'
    })
  }
}
