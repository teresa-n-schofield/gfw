define(['Class', 'uri', 'moment', 'map/services/DataService'], (
  Class,
  UriTemplate,
  moment,
  ds
) => {
  const REQUEST_ID = 'TorqueDateService:fetchDates';

  const TorqueDateService = Class.extend({
    init(options) {
      this.options = options || {};
      this._defineRequests();
    },

    _defineRequests() {
      let endOfDay = moment().endOf('day'),
        secondsToEndOfDay = endOfDay.diff(moment()) / 1000;

      const config = {
        cache: {
          type: 'persist',
          duration: secondsToEndOfDay,
          unit: 'seconds'
        },
        url: this._getUrl(),
        type: 'POST',
        dataType: 'jsonp'
      };

      ds.define(REQUEST_ID, config);
    },

    _getUrl() {
      let template = 'https://wri-01.carto.com/api/v2/sql{?q}',
        sql = [
          'SELECT DISTINCT date',
          `FROM ${this.options.table_name}`,
          'ORDER BY date DESC'
        ].join(' '),
        url = new UriTemplate(template).fillFromObject({ q: sql });

      return url;
    },

    fetchDates(layer) {
      const deferred = new $.Deferred();

      const onSuccess = function (result) {
        const dates = result.rows.map((row) => new Date(row.date).getTime());

        deferred.resolve(dates);
      };

      const config = {
        resourceId: REQUEST_ID,
        success: onSuccess,
        error: deferred.reject
      };

      ds.request(config);

      return deferred.promise();
    }
  });

  return TorqueDateService;
});
