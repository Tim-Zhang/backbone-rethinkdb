rethinkdb-backbone-model
===========================
## What is this?
A Backbone-Model syncing with rethinkdb.
just use it like normal Backbone-Model, the only different is syncing(replace ajax to rethinkdb)

## Usage

```
var co = require('co')
  , _ = require('underscore')

var RethinkModel = require('../backbone.rethinkdb.model')({database: 'test', table: 'user'});

var passed = 0;
var User = RethinkModel.extend({
    table: 'user'
});

co(function* () {

    // Create
    var user = new User({name: 'Lilei', age: 18, sex: 'male'})
    yield user.save();

    // Fetch
    var id = user.id
      , user2 = new User({id: id});

    yield user2.fetch();

    // Modify
    yield user2.save({age: 19});


}).catch(function(error) { console.error(error); });

```
