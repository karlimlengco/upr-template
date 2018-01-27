import { db } from '../../server/db.js'

export default {

  /**
   * [all description]
   * @param  {Function} cb [description]
   * @return {[type]}      [description]
   */
  getAll (page = 1) {
    var users = []

    db.serialize(function () {
      db.each('select * from users;', function (err, row) {
        users.push(row)
        if (err) {
          console.log(err)
        }
      }, function (err, rowCount) {
        if (err) {
          console.log(err)
        }
      })
    })
    return users
  },

  /**
   * [syncNew description]
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  markAsSync (users) {
    db.serialize(function () {
      for (var key in users) {
        var uuid = users[key].uuid
        db.run('update users set is_sync=1 where uuid=?', {
          1: uuid
        })
      }
    })
  },

  /**
   * [syncNew description]
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  syncNew (users) {
    db.serialize(function () {
      users.data.map(function (value, key) {
        // check if already exist
        var id = value['id']
        db.get('select id from users where id=?', {1: id}, function (err, row) {
          if (row == null) {
            var fields = ['is_sync']
            var values = ['1']
            var placeholder = "?"
            for (var keyVal in value) {
              fields.push(keyVal)
              values.push(value[keyVal])
              placeholder += ",?"
            }
            if( id == localStorage.getItem('user_id') ) {
              fields.push('password')
              values.push( localStorage.getItem('password') )
              placeholder += ",?"
            }

            db.run('INSERT INTO users (' + fields.join() + ') VALUES (' + placeholder + ')', values, function (err, row) {
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
                db.run("UPDATE users SET " + fields.join(',') + " WHERE id = ?", vals, function(err, row) {
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
  /**
   * [syncNew description]
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  syncNewRole (users) {
    db.serialize(function () {
      users.map(function (value, key) {
        // check if already exist
        var id = value['id']
        db.get('select id from role_users where id=?', {1: id}, function (err, row) {
          if (row == null) {
            var fields = ['is_sync']
            var values = ['1']
            var placeholder = "?"
            for (var keyVal in value) {
              fields.push(keyVal)
              values.push(value[keyVal])
              placeholder += ",?"
            }

            db.run('INSERT INTO role_users (' + fields.join() + ') VALUES (' + placeholder + ')', values, function (err, row) {
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
                db.run("UPDATE role_users SET " + fields.join(',') + " WHERE id = ?", vals, function(err, row) {
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

  save (user) {
    var fields = []
    var values = []
    var placeholder = ""
    var count = 0
    for (var key in user) {
      if (count == 0) {
        placeholder += "?"
      } else {
        placeholder += ",?"
      }
      count ++
      fields.push(key)
      values.push(user[key])
    }
    db.serialize(function () {
      db.run('INSERT INTO users (' + fields.join() + ') VALUES (' + placeholder + ')', values, function (err, row) {
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

    db.serialize(function () {
      db.run("UPDATE users SET " + fields.join(',') + " WHERE id = ?", values, function(err, row) {
        if (err) {
          console.log(err)
        }
      })
    })
  },
  updateRoleUser (unit) {

    var user_id = unit.user_id
    db.serialize(function () {
      db.run("DELETE FROM role_users WHERE user_id=?", user_id, function (err, row) {
        if (err) {
          console.log(err)
        }
      })
    })

    for (var key in unit.role_id) {
      var role = unit.role_id[key]
      db.serialize(function () {
        db.run("INSERT INTO role_users (user_id, role_id) VALUES (?, ?)", [user_id, role], function (err, row) {
          if (err) {
            console.log(err)
          }
        })
      })
    }
  }

}
