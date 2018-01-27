import axios from 'axios'
import { API_ROOT } from '../../config.js'
import { db } from '../../server/db.js'


export default {
  /**
   * [all description]
   * @param  {Function} cb [description]
   * @return {[type]}      [description]
   */
  all (page = 1) {
    return axios.get(
      API_ROOT + 'api/diir?token=' + localStorage.getItem('id_token')
    )
  },

  /**
   * [all description]
   * @param  {Function} cb [description]
   * @return {[type]}      [description]
   */
  serverPush (model) {
    axios.post(API_ROOT + 'api/diir?token=' + localStorage.getItem('id_token'), {
      model
    }).then(response => {
      db.serialize(function () {
        for (var key in response.data.model) {
          var id = response.data.model[key].id
          db.run('update delivery_inspection set is_sync=1 where id=?', {
            1: id
          })
        }
      })
    }).catch(e => {
      console.log(e)
    })
  },

  /**
   * [findById description]
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  findById (id) {
    return axios.get({
      id: id
    })
  },

  /**
   * [save description]
   * @param  {[type]}   doc [description]
   * @param  {Function} cb  [description]
   * @return {[type]}       [description]
   */
  save (model) {
    return axios.save(model)
  },
  /**
   * [update description]
   * @param  {[type]}   doc [description]
   * @param  {Function} cb  [description]
   * @return {[type]}       [description]
   */
  update (id, model) {
    return axios.update({
      id: id
    }, model)
  },
  /**
   * [remove description]
   * @param  {[type]} doc [description]
   * @param  {[type]} db  [description]
   * @return {[type]}     [description]
   */
  delete (id) {
    return axios.delete({
      id: id
    })
  }
}
