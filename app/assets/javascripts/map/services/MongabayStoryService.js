/**
 * Aysynchronous service for use stories layer.
 *
 */
define(['Class', 'underscore', 'map/services/DataService'], (
  Class,
  _,
  ds
) => {
  const UserStoryService = Class.extend({
    requestId: 'MongabayStoryService',

    url:
      'https://wri-01.carto.com/api/v2/sql?q=SELECT * FROM mongabay &format=json',

    /**
     * Constructs a new instance of StoryService.
     *
     * @return {StoryService} instance
     */
    init() {
      this._defineRequests();
    },

    /**
     * Defines JSON requests used by StoryService.
     */
    _defineRequests() {
      const cache = { type: 'persist', duration: 1, unit: 'days' };
      const url = this.url;
      const config = { cache, url, type: 'GET', dataType: 'json' };
      ds.define(this.requestId, config);
    },

    fetchStories(successCb, errorCb) {
      function _parseData(data) {
        const result = _.map(data.rows, (d) => {
          d.lng = d.lon;
          return d;
        });
        successCb(result);
      }

      ds.request({
        resourceId: this.requestId,
        success: _parseData,
        error: errorCb
      });
    }
  });

  const service = new UserStoryService();

  return service;
});
