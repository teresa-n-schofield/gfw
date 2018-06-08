define(['Class', 'uri', 'map/services/DataService'], (
  Class,
  UriTemplate,
  ds
) => {
  const REQUEST_ID = 'CartoDbLayerService:fetchLayerConfig';

  const URL = 'https://wri-01.carto.com/api/v1/map?stat_tag=API';

  const CartoDbLayerService = Class.extend({
    init(sql, cartocss) {
      this.config = {
        version: '1.2.0',
        layers: [
          {
            type: 'cartodb',
            options: {
              sql,
              cartocss,
              cartocss_version: '2.3.0'
            }
          }
        ]
      };

      this._defineRequests();
    },

    _defineRequests() {
      const config = {
        cache: { type: 'persist', duration: 1, unit: 'days' },
        url: URL,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8'
      };

      ds.define(REQUEST_ID, config);
    },

    fetchLayerConfig() {
      const deferred = new $.Deferred();

      const config = {
        resourceId: REQUEST_ID,
        data: JSON.stringify(this.config),
        success: deferred.resolve,
        error: deferred.reject
      };

      ds.request(config);

      return deferred.promise();
    }
  });

  return CartoDbLayerService;
});
