/**
 *
 * backbone cartodb adapter
 *
 * this is a small library that allows to use Backbone with models
 * to work with data stored in CartoDB (a geospatial database on
 * the cloud, see more info at http://carto.com).
 *
 * it does NOT overrride Backbone.sync
 *
 */

Backbone.CartoDB = function (options, query, cache) {
  options = _.defaults(options, {
    USE_PROXY: false,
    user: ''
  });

  function _SQL(sql) {
    this.sql = sql;
  }
  function SQL(sql) {
    return new _SQL(sql);
  }

  // SQL("{0} is {1}").format("CartoDB", "epic!");
  _SQL.prototype.format = function () {
    let str = this.sql,
      len = arguments.length + 1;
    let safe,
      arg;
    for (i = 0; i < len; arg = arguments[i++]) {
      safe = typeof arg === 'object' ? JSON.stringify(arg) : arg;
      str = str.replace(RegExp(`\\{${i - 1}\\}`, 'g'), safe);
    }
    return str;
  };

  const resource_path = `${options.user}.carto.com/api/v1/sql`;
  const resource_url = `https://${resource_path}`;

  /**
   * fetch sql from the server
   *
   * this function should be changed if you're working on node
   *
   */
  query =
    query ||
    function (sql, callback, proxy) {
      let url = resource_url;
      let crossDomain = true;
      if (proxy) {
        url = `api/v0/proxy/${resource_url}`;
        crossDomain = false;
      }
      if (sql.length > 1500) {
        $.ajax({
          url,
          crossDomain,
          type: 'POST',
          dataType: 'json',
          data: `q=${encodeURIComponent(sql)}`,
          success: callback,
          error() {
            if (proxy) {
              callback();
            } else {
              // try fallback
              if (USE_PROXY) {
                query(sql, callback, true);
              }
            }
          }
        });
      } else {
        // TODO: add timeout
        $.getJSON(
          `${resource_url}?q=${encodeURIComponent(sql)}&callback=?`
        )
          .success(callback)
          .fail(() => {
            callback();
          })
          .complete(() => {});
      }
    };

  const dummy_cache = {
    setItem(key, value) {},
    getItem(key) {
      return null;
    },
    removeItem(key) {}
  };

  cache = cache && dummy_cache;

  const CartoDBModel = Backbone.Model.extend({
    _create_sql() {
      const where = SQL(" where {0} = '{1}'").format(
        this.columns[this.what],
        this.get(this.what).replace("'", "''")
      );
      const select = this._sql_select();
      const sql = `select ${select.join(',')} from ${this.table}${where}`;
      return sql;
    },

    _sql_select() {
      const select = [];
      for (const k in this.columns) {
        const w = this.columns[k];
        if (w.indexOf('ST_') !== -1 || w === 'the_geom') {
          select.push(SQL('ST_AsGeoJSON({1}) as {0}').format(k, w));
        } else {
          select.push(SQL('{1} as {0}').format(k, w));
        }
      }
      return select;
    },

    _parse_columns(row) {
      const parsed = {};
      for (const k in row) {
        const v = row[k];
        const c = this.columns[k];
        if (c.indexOf('ST_') !== -1 || c === 'the_geom') {
          parsed[k] = JSON.parse(v);
        } else {
          parsed[k] = row[k];
        }
      }
      return parsed;
    },

    fetch() {
      const self = this;
      query(this._create_sql(), (data) => {
        self.set(self._parse_columns(data.rows[0]));
      });
    }
  });

  /**
   * cartodb collection created from a sql composed using 'columns' and
   * 'table' attributes defined in a child class
   *
   * var C = CartoDBCollection.extend({
   *  table: 'table',
   *  columns: ['c1', 'c2']
   * });
   * var c = new C();
   * c.fetch();
   */
  const CartoDBCollection = Backbone.Collection.extend({
    _create_sql() {
      let tables = this.table;
      if (!_.isArray(this.table)) {
        tables = [this.table];
      }
      tables = tables.join(',');
      const select = CartoDBModel.prototype._sql_select.call(this);
      let sql = `select ${select.join(',')} from ${this.table}`;
      if (this.where) {
        sql += ` WHERE ${this.where}`;
      }
      return sql;
    },

    fetch() {
      const self = this;
      let sql = this.sql || this._create_sql();
      if (typeof sql === 'function') {
        sql = sql.call(this);
      }
      const item = this.cache ? cache.getItem(sql) : false;
      if (!item) {
        query(sql, function (data) {
          if (this.cache) {
            try {
              cache.setItem(sql, JSON.stringify(data.rows));
            } catch (e) {}
          }
          let rows;
          if (!self.sql) {
            rows = _.map(data.rows, (r) => CartoDBModel.prototype._parse_columns.call(self, r));
          } else {
            rows = data.rows;
          }
          self.reset(rows);
        });
      } else {
        self.reset(JSON.parse(item));
      }
    }
  });

  return {
    query,
    CartoDBCollection,
    CartoDBModel,
    SQL
  };
};
