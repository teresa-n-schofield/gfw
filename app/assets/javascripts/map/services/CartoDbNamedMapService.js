define(['Class', 'bluebird', 'map/services/DataService'], (
  Class,
  Promise,
  ds
) => {
  const REQUEST_ID = 'CartoDbNamedMapService:fetchLayerMap';
  const URL = 'https://wri-01.carto.com/api/v1/map/named/';

  const CartoDbNamedMapService = Class.extend({
    init(options) {
      this.namedMap = options.namedMap;
      this.table = options.table;

      this._defineRequests();
    },

    _defineRequests() {
      ds.define(REQUEST_ID, {
        cache: { type: 'persist', duration: 1, unit: 'days' },
        url: URL + this.namedMap,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8'
      });
    },

    fetchLayerConfig() {
      return new Promise(
        ((resolve, reject) => {
          const layerConfig = {
            table: this.table
          };

          const requestConfig = {
            resourceId: REQUEST_ID,
            data: JSON.stringify(layerConfig),
            success: resolve,
            error: reject
          };

          ds.request(requestConfig);
        })
      );
    }
  });

  return CartoDbNamedMapService;
});
