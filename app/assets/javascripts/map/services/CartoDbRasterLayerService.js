define(['Class', 'bluebird', 'map/services/DataService'], (
  Class,
  Promise,
  ds
) => {
  const MAP_REQUEST_ID = 'CartoDbLayerService:fetchRasterLayerMap';
  const MAP_URL = 'https://wri-01.carto.com/api/v1/map?stat_tag=API';

  const CartoDbRasterLayerService = Class.extend({
    init(sql, cartocss) {
      this.sql = sql;
      this.cartocss = cartocss;

      this._defineRequests();
    },

    _defineRequests() {
      ds.define(MAP_REQUEST_ID, {
        cache: { type: 'persist', duration: 1, unit: 'days' },
        url: MAP_URL,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8'
      });
    },

    fetchLayerConfig() {
      return new Promise(
        ((resolve, reject) => {
          const layerConfig = {
            version: '1.2.0',
            layers: [
              {
                type: 'cartodb',
                options: {
                  sql: this.sql,
                  cartocss: this.cartocss,
                  cartocss_version: '2.3.0',
                  geom_column: 'the_raster_webmercator',
                  geom_type: 'raster',
                  raster_band: 1
                }
              }
            ]
          };

          const requestConfig = {
            resourceId: MAP_REQUEST_ID,
            data: JSON.stringify(layerConfig),
            success: resolve,
            error: reject
          };

          ds.request(requestConfig);
        })
      );
    }
  });

  return CartoDbRasterLayerService;
});
