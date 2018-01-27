import { db } from '../../server/db.js'

export default {

  /**
   * [syncNew description]
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  markAsSync (upr) {
    db.serialize(function () {
      for (var key in upr) {
        var id = upr[key].id
        db.run('update unit_purchase_request_items set is_sync=1 where id=?', {
          1: id
        })
      }
    })
  },

  /**
   * [syncNew description]
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  syncNew (upr) {
    db.serialize(function () {
      upr.map(function (value, key) {
        // check if already exist
        var id = value['id']
        db.get('select id from unit_purchase_request_items where id=?', {1: id}, function (err, row) {
          if (row == null) {
            var fields = ['is_sync']
            var values = ['1']
            var placeholder = "?"

            for (var keyVal in value) {
              placeholder += ",?"
              fields.push(keyVal)
              values.push(value[keyVal])
            }
            var newVal = '"' + values.join('","') + '"'
            db.run('INSERT INTO unit_purchase_request_items (' + fields.join() + ') VALUES (' + placeholder + ')', values, function (err, row) {
              if (err) {
                console.log(err)
              }
            })
          }

          if(row != null) {
            if(row.updated_at == null || row.updated_at < value['updated_at']) {
              var fields = []
              var vals = []
              for (var key in value) {
                fields.push(key+' = ?')
                vals.push(value[key])
              }
              vals.push(id)

              db.serialize(function () {
                db.run("UPDATE unit_purchase_request_items SET " + fields.join(',') + " WHERE id = ?", vals, function(err, row) {
                  if (err) {
                    console.log(err)
                  }
                })
              })
            }
          }

          if (err) {
            console.log(err)
          }
        })
      })
    })
  },

  save (items) {
    for (var key in items) {
      var fields = []
      var values = []
      var placeholder = ""
      var count = 0

      for (var key2 in items[key]) {
        if (count == 0) {
          placeholder += "?"
        } else {
          placeholder += ",?"
        }
        count ++
        fields.push(key2)
        values.push(items[key][key2])
      }

      var newVal = '"' + values.join('","') + '"'
      db.serialize(function () {
        db.run('INSERT INTO unit_purchase_request_items (' + fields.join() + ') VALUES (' + placeholder + ')', values, function (err, row) {
          if (err) {
            console.log(err)
          }
        })
      })
    }
  }

}
