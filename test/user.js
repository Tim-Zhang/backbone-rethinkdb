var co = require('co')
  , _  = require('underscore')
  , r = require('../co.rethinkdb')()
  , BackboneRdb = require('../index')({database: 'test', table: 'user'});

var passed = 0;

// Collection
var Users = BackboneRdb.Collection.extend({
    table: 'user'
});
// Model
var User = BackboneRdb.Model.extend({
    table: 'user'
});


co(function* () {
    /* Model Test */

    // Create Database `test` and Table `user` for test.
    yield createDbTable();

    // Create User
    var user = new User({name: 'Lilei', age: 18, sex: 'male'})
    yield user.save();

    // Fetch User
    var id = user.id
      , user2 = new User({id: id});

    yield user2.fetch();

    if ( _.isEqual(user.toJSON(), user2.toJSON()) ) {
        console.log('Create/Fetch Model is OK.');
        passed++;
    } else {
        console.error('There are some errors about create/fetch Model');
    }

    // Modify User
    yield user2.save({age: 19});
    yield user.fetch();

    if (user.get('age') === 19) {
        console.log('Modify Model is OK.');
        passed++;
    } else {
        console.error('There are some errors about modify Model');
    }

    /* Collection Test */
    var users = new Users()
    yield users.fetch();
    if (users.length > 0 && user instanceof BackboneRdb.Model) {
        console.log('Collection is OK.');
        passed++;
    } else {
        console.error('There are some errors about Collection');
    }

    if (passed === 3) console.log('====== Everthing is OK. ======');

}).catch(function(error) { console.error(error); });

function* createDbTable() {
    try { yield r.dbCreate('test'); } catch(e) {} finally {
        try { yield r.tableCreate('user'); } catch(e) {}
    }
}


