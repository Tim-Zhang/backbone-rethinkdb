var _        = require('underscore')
  , Backbone = require('backbone')
  , co       = require('co')
  , _r       = require('./co.rethinkdb')
  , rModel   = require('./backbone.rethinkdb.model');


module.exports = function(dbconfig) {
    dbconfig || (dbconfig = {
          host: 'localhost'
        , database: 'test'
        , port: 28015
    });

    if (!dbconfig.host) dbconfig.host = 'localhost';
    if (!dbconfig.port) dbconfig.port = 28015;

    return Backbone.Collection.extend({
        table: 'test'
        , model: rModel(dbconfig)

        , initialize: function( attr, options ) {
            if ( options ) {
                _.extend(this, _.pick(options, 'table'));
            }
        }

        , sync: function(method, model, options) {
            var params = { method: method };

            if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
              params.data = options.attrs || model.toJSON(options);
            }

            var xhr = options.xhr = this.ajax(_.extend(params, options));

            model.trigger('request', model, xhr, options);
            return xhr;
        }

        , count: function() {
            var that = this
              , r = _r(dbconfig);

            return co(function* () {
                return yield r.table(that.table).count()
            });
        }

        , ajax: function(params) {
            var result
            , method = params.method
            , that = this
            , table = this.table
            , start = params.start || 0
            , orderBy = params.orderBy || 'createTime'
            , length = params.length || 100

            return co(function* (){
                if (orderBy){
                    result = yield r.table(table).orderBy(orderBy).slice(start, length);
                } else {
                    result = yield r.table(table).limit(5);
                }

                params.success && params.success(result);
                return result;
            })

        }

    });
}