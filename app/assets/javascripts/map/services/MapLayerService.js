/**
 * Aysynchronous service for accessing map layer metadata.
 *
 */
define(
  ['Class', 'mps', 'store', 'map/services/DataService', 'uri', 'underscore'],
  (Class, mps, store, ds, UriTemplate, _) => {
    const MapLayerService = Class.extend({
      requestId: 'MapLayerService:getLayers',

      /**
       * Constructs a new instance of MapLayerService.
       *
       * @return {MapLayerService} instance
       */
      init() {
        // this.layers = null;
        this._defineRequests();
      },

      /**
       * The configuration for client side caching of results.
       */
      _cacheConfig: { type: 'persist', duration: 1, unit: 'days' },

      /**
       * Defines CartoDB requests used by MapLayerService.
       */
      _defineRequests() {
        const cache = this._cacheConfig;
        const url = this._getUrl();
        const config = {
          cache,
          url,
          type: 'POST',
          dataType: 'jsonp'
        };
        ds.define(this.requestId, config);
      },

      /**
       * Asynchronously get layers for supplied array of where specs.
       *
       * @param  {array} where Where objects (e.g., [{id: 123}, {slug: 'loss'}])
       * @param  {function} successCb Function that takes the layers if found.
       * @param  {function} errorCb Function that takes an error if on occurred.
       */
      getLayers(where, successCb, errorCb) {
        this._fetchLayers(
          _.bind(function (layers) {
            // filter iso layers and pack them, then send the package to the presenter
            mps.publish('Country/layers', [this.getParsedLayers(layers)]);

            const hits = _.map(where, _.partial(_.where, layers.rows));
            successCb(_.flatten(hits));
          }, this),
          _.bind((error) => {
            errorCb(error);
          }, this)
        );
      },

      getAllLayers(filterFn, successCb, errorCb) {
        this._fetchLayers(
          (layers) => {
            successCb(_.filter(layers.rows, filterFn));
          },
          (error) => {
            errorCb(error);
          }
        );
      },

      getParsedLayers(layers) {
        let countryLayers = _.filter(layers.rows, (lay) => lay.iso != null);

        _.each(countryLayers, (layer) => {
          if (layer.does_wrapper) {
            const does_wrapper = JSON.parse(layer.does_wrapper);
            // Store the wrapped layers here
            layer.wrappers = {};

            _.each(does_wrapper, (wrap_layer) => {
              // Add the wrapped layer to the wrapper array
              layer.wrappers[wrap_layer.slug] = _.findWhere(countryLayers, {
                slug: wrap_layer.slug
              });
              layer.wrappers[wrap_layer.slug].radio_title = wrap_layer.title;

              countryLayers = _.without(
                countryLayers,
                _.findWhere(countryLayers, {
                  slug: wrap_layer.slug
                })
              );
            });
          }
        });

        return countryLayers;
      },

      _getUrl() {
        let template = null;
        let sql = null;

        if (!this.url) {
          template = 'https://wri-01.carto.com/api/v2/sql{?q}';
          /* jshint multistr: true */
          sql =
            `SELECT \
                cartodb_id AS id, \
                slug, \
                title, \
                title_color, \
                analyzable, \
                subtitle, \
                sublayer, \
                table_name, \
                source, \
                source_json, \
                category_color, \
                category_slug, \
                is_forest_clearing, \
                category_name, \
                external, \
                iso, \
                zmin, \
                zmax, \
                mindate, \
                maxdate, \
                ST_XMAX(the_geom) AS xmax, \
                ST_XMIN(the_geom) AS xmin, \
                ST_YMAX(the_geom) AS ymax, \
                ST_YMIN(the_geom) AS ymin, \
                tileurl, \
                does_wrapper, \
                user_data, \
                parent_layer, \
                true AS visible \
              FROM \
                ${
  window.gfw.layer_spec
} \
              WHERE \
                display = 'true' \
              ORDER BY \
                displaylayer, \
                title ASC`;
          this.url = new UriTemplate(template).fillFromObject({ q: sql });
        }

        return this.url;
      },

      _fetchLayers(successCb, errorCb) {
        const config = {
          resourceId: this.requestId,
          success: successCb,
          error: errorCb
        };

        ds.request(config);
      }
    });

    const service = new MapLayerService();

    return service;
  }
);
