import { db } from '../../server/db.js'

export default {

  /**
   * [syncNew description]
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  markAsSync (accounts) {
    console.log('sync')
    db.serialize(function () {
      for (var key in accounts) {
        var id = accounts[key].id
        db.run('update mode_of_procurements set is_sync=1 where id=?', {
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
  syncNew (accounts) {
    db.serialize(function () {
      accounts.map(function (value, key) {
        // check if already exist
        var id = value['id']
        db.get('select id from mode_of_procurements where id=?', {1: id}, function (err, row) {
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
            db.run('INSERT INTO mode_of_procurements (' + fields.join() + ') VALUES (' + placeholder + ')', values, function (err, row) {
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
                db.run("UPDATE mode_of_procurements SET " + fields.join(',') + " WHERE id = ?", vals, function(err, row) {
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

  save (unit) {
    var fields = []
    var values = []
    var placeholder = ""
    var count = 0

    for (var key in unit) {
      if (count == 0) {
        placeholder += "?"
      } else {
        placeholder += ",?"
      }
      count ++
      fields.push(key)
      values.push(unit[key])
    }
    var newVal = '"' + values.join('","') + '"'
    db.serialize(function () {
      db.run('INSERT INTO mode_of_procurements (' + fields.join() + ') VALUES (' + placeholder + ')', values, function (err, row) {
        if (err) {
          console.log(err)
        }
      })
    })
  }

}
