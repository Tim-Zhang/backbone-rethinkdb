Backbone-RethinkDB
===========================
## What is this?
A Backbone version syncing with rethinkdb.
just use it like normal Backbone, the only difference is syncing(replace ajax to rethinkdb)

## Usage

```
var co = require('co')
  , _ = require('underscore')
  , BackboneRdb = require('backbone-rethinkdb')({database: 'test', table: 'user'});

var passed = 0;
var User = BackboneRdb.Model.extend({
    table: 'user'
});

var Users = BackboneRdb.Collection.extend({
    table: 'user'
});

co(function* () {

    // Create Model
    var user = new User({name: 'Lilei', age: 18, sex: 'male'})
    yield user.save();

    // Fetch Model
    var id = user.id
      , user2 = new User({id: id});

    yield user2.fetch();

    // Modify Model
    yield user2.save({age: 19});

    // Fetch Collection
    yield new Users().fetch();


}).catch(function(error) { console.error(error); });

```

## Compatibility
- node >= 0.11.13
- use `node --harmony`
