var _        = require('underscore')
  , Q        = require('q')
  , Backbone = require('backbone')
  , co       = require('co')
  , r        = require('./co.rethinkdb')


module.exports = function(dbconfig) {
    dbconfig || (dbconfig = {
          host: 'localhost'
        , database: 'test'
        , table: 'test'
        , port: 28015
    });

    if (!dbconfig.host) dbconfig.host = 'localhost';
    if (!dbconfig.port) dbconfig.port = 28015;

    return Backbone.Model.extend({
          dbconfig: dbconfig
        , filterId: 'id'

        , sync: function(method, model, options) {
            var params = { method: method };

            if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
              params.data = options.attrs || model.toJSON(options);
            }

            var xhr = options.xhr = this.ajax(_.extend(params, options));

            model.trigger('request', model, xhr, options);
            return xhr;
        }

        , ajax: function(params) {
            var result
            , method = params.method
            , that = this
            , table = this.dbconfig.table
            , deferred = Q.defer()

            r.config = this.dbconfig;

            co(function* (){
                createdTime = Date.now();
                switch (method) {
                    case 'read':
                        if (that.id) {
                            result = yield r.table(table).get(that.id);
                        } else {
                            cursor = yield r.table(table).filter(r.row(that.filterId).eq(that.get(that.filterId)));
                            result = yield cursor.toArray();
                            result = result[0];
                        }
                        break;
                    case 'create':
                        params.data.createdTime = createdTime;
                        result = yield r.table(table).insert(params.data);
                        break;
                    case 'update':
                    case 'patch':
                        result = yield r.table(table).get(that.id).update(params.data);
                        break;
                    case 'delete':
                        result = yield r.table(table).get(that.id).delete();
                        break;
                }

                if (!result || method !== 'read' && result.errors && params.error) {
                    params.error(result);
                    deferred.reject(new Error());
                    return;
                }

                if (method === 'create') {
                    result = { id: result.generated_keys[0], createdTime: createdTime }
                } else if (_.contains(['update', 'patch'], method)) {
                    result = that.toJSON()
                }

                params.success && params.success(result);
                deferred.resolve(result);


            });

            return deferred.promise;
        }

        , save: function(key, val, options) {
            return Backbone.Model.prototype.save.call(this, key, val, _.extend({ patch: true }, options));
        }


    });
}