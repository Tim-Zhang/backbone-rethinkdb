Backbone-RethinkDB
===========================
## What is this?
A Backbone version syncing with rethinkdb.
just use it like normal Backbone, the only different is syncing(replace ajax to rethinkdb)

## Usage

```
var co = require('co')
  , _ = require('underscore')

var RethinkModel = require('../backbone.rethinkdb.model')({database: 'test', table: 'user'});

var passed = 0;
var User = RethinkModel.extend({
    table: 'user'
});

var Users = RethinkCollection.extend({
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
