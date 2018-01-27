import { db } from '../../server/db.js'

export default {

  /**
   * [syncNew description]
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  markAsSync (roles) {
    console.log('sync')
    db.serialize(function () {
      for (var key in roles) {
        var id = roles[key].id
        db.run('update roles set is_sync=1 where id=?', {
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
  syncNew (roles) {
    db.serialize(function () {
      roles.map(function (value, key) {
        // check if already exist
        var id = value['id']
        db.get('select id from roles where id=?', {1: id}, function (err, row) {
          if (row == null) {
            var fields = ['is_sync']
            var values = ['1']
            var placeholder = "?"

            for (var keyVal in value) {
              if (keyVal === 'permissions') {
                fields.push(keyVal)
                values.push(JSON.stringify(value[keyVal]))
              } else {
                fields.push(keyVal)
                values.push(value[keyVal])
              }
              placeholder += ",?"
            }
            var newVal = "'" + values.join("','") + "'"
            db.run('INSERT INTO roles (' + fields.join() + ') VALUES (' + placeholder + ')', values, function (err, row) {
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
                if (key === 'permissions') {
                  fields.push(key+' = ?')
                  vals.push(JSON.stringify(value[key]))
                } else {
                  fields.push(key+' = ?')
                  vals.push(value[key])
                }
                placeholder += ",?"
              }
              vals.push(id)

              db.serialize(function () {
                db.run("UPDATE roles SET " + fields.join(',') + " WHERE id = ?", vals, function(err, row) {
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

  save (roles) {
    var fields = []
    var values = []
    var placeholder = ""
    var count = 0

    for (var key in roles) {
      if (count == 0) {
        placeholder += "?"
      } else {
        placeholder += ",?"
      }
      count ++
      fields.push(key)
      values.push(roles[key])
    }
    var newVal = '"' + values.join('","') + '"'
    db.serialize(function () {
      db.run('INSERT INTO roles (' + fields.join() + ') VALUES (' + placeholder + ')', values, function (err, row) {
        if (err) {
          console.log(err)
        }
      })
    })
  }

}
