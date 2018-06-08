define(
  ['Class', 'uri', 'bluebird', 'moment', 'map/services/DataService'],
  (Class, UriTemplate, Promise, moment, ds) => {
    const REQUEST_ID = 'CartoDbLayerDateService:fetchLayerDates';
    const URL = 'https://wri-01.carto.com/api/v2/sql{?q}';

    const CartoDbLayerDateService = Class.extend({
      init(options) {
        this.dateAttribute = options.dateAttribute;
        this.table = options.table;

        this._defineRequests();
      },

      _defineRequests() {
        let sql =
            `SELECT MIN(${
              this.dateAttribute
            }) AS min_date, MAX(${
              this.dateAttribute
            }) AS max_date FROM ${
              this.table}`,
          url = new UriTemplate(URL).fillFromObject({ q: sql });

        let endOfDay = moment().endOf('day'),
          secondsToEndOfDay = endOfDay.diff(moment()) / 1000;

        ds.define(REQUEST_ID, {
          cache: {
            type: 'persist',
            duration: secondsToEndOfDay,
            unit: 'seconds'
          },
          url,
          type: 'GET'
        });
      },

      fetchLayerConfig() {
        return new Promise(((resolve, reject) => {
          const onSuccess = function (response) {
            resolve(response.rows[0]);
          };

          const requestConfig = {
            resourceId: REQUEST_ID,
            success: onSuccess,
            error: reject
          };

          ds.request(requestConfig);
        }));
      }
    });

    return CartoDbLayerDateService;
  }
);
