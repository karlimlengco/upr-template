import { db } from '../../server/db.js'

export default {

  /**
   * [syncNew description]
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  markAsSync (units) {
    console.log('sync')
    db.serialize(function () {
      for (var key in units) {
        var id = units[key].id
        db.run('update bid_opening set is_sync=1 where id=?', {
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
  syncNew (units) {
    db.serialize(function () {
      units.map(function (value, key) {
        // check if already exist
        var id = value['id']
        db.get('select id from bid_opening where id=?', {1: id}, function (err, row) {
          if (row == null) {
            var fields = ['is_sync']
            var values = ['1']
            var placeholder = "?"

            for (var keyVal in value) {
              if (keyVal === 'upr') {
                fields.push('total_amount')
                values.push(value[keyVal].total_amount)
              } else if(keyVal === 'proponents') {
                fields.push(keyVal)
                values.push(JSON.stringify(value[keyVal]))
              } else {
                fields.push(keyVal)
                values.push(value[keyVal])
              }
              placeholder += ",?"
            }
            var newVal = '"' + values.join('","') + '"'
            db.run('INSERT INTO bid_opening (' + fields.join() + ') VALUES (' + placeholder + ')', values, function (err, row) {
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
                db.run("UPDATE bid_opening SET " + fields.join(',') + " WHERE id = ?", vals, function(err, row) {
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
      db.run('INSERT INTO bid_opening (' + fields.join() + ') VALUES (' + placeholder + ')', values, function (err, row) {
        if (err) {
          console.log(err)
        }
      })
    })
  },

  update (id, unit) {
    var fields = []
    var values = []
    for (var key in unit) {
      fields.push(key+' = ?')
      values.push(unit[key])
    }
    values.push(id)
    var newVal = '"' + values.join('","') + '"'
    db.serialize(function () {
      db.run("UPDATE bid_opening SET " + fields.join(',') + " WHERE id = ?", values, function(err, row) {
        if (err) {
          console.log(err)
        }
      })
    })
  },

  update (id, unit) {
    var fields = []
    var values = []
    for (var key in unit) {
      fields.push(key+' = ?')
      values.push(unit[key])
    }
    values.push(id)
    var newVal = '"' + values.join('","') + '"'
    db.serialize(function () {
      db.run("UPDATE bid_opening SET " + fields.join(',') + " WHERE id = ?", values, function(err, row) {
        if (err) {
          console.log(err)
        }
      })
    })
  }

}
