var co = require('co')
  , _ = require('underscore')
  , r = require('../co.rethinkdb')

var RethinkModel = require('../backbone.rethinkdb.model')({database: 'test', table: 'user'});

var passed = 0;
var User = RethinkModel.extend({
    table: 'user'
});

co(function* () {

    // Create Database `test` and Table `user` for test.
    try {
        yield r.dbCreate('test');
        yield r.tableCreate('user');
    } catch(e) {
        // Ignore all exceptions becauseof they caused by exist database or table
    }

    // Create User
    var user = new User({name: 'Lilei', age: 18, sex: 'male'})
    yield user.save();

    // Fetch User
    var id = user.id
      , user2 = new User({id: id});

    yield user2.fetch();

    if ( _.isEqual(user.toJSON(), user2.toJSON()) ) {
        console.log('Create and Fetch functions are OK.');
        passed++;
    } else {
        console.error('There are some errors about create or fetch functions');
    }

    // Modify User
    yield user2.save({age: 19});
    yield user.fetch();

    if (user.get('age') === 19) {
        console.log('Modify function is OK.');
        passed++;
    } else {
        console.error('There are some errors about modify function');
    }

    if (passed === 2) console.log('====== Everthing is OK. ======');

}).catch(function(error) { console.error(error); });




