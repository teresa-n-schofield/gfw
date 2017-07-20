define([
  'Class',
  'uri',
  'bluebird',
  'map/services/DataService'
], function(Class, UriTemplate, Promise, ds) {

  'use strict';

  var GET_REQUEST_LANDSAT_TILES_ID = 'LandsatService:getTiles';

  var APIURL = window.gfw.config.GFW_API_HOST_PROD;

  var APIURLS = {
    'getTiles': '/landsat-tiles/{year}'
  };

  var LandsatService = Class.extend({
    init: function() {
      this.currentRequest = [];
    },

    getTiles: function(year) {
      return new Promise(function(resolve, reject) {
        var url = new UriTemplate(APIURLS.getTiles).fillFromObject({
          year: year
        });

        this.defineRequest(GET_REQUEST_LANDSAT_TILES_ID,
          url, { type: 'persist', duration: 1, unit: 'days' });

        var requestConfig = {
          resourceId: GET_REQUEST_LANDSAT_TILES_ID,
          success: function(res, status) {
            resolve(res.data, status);
          },
          error: function(errors) {
            reject(errors);
          }
        };

        this.currentRequest[GET_REQUEST_LANDSAT_TILES_ID] = ds.request(requestConfig);
      }.bind(this));
    },

    defineRequest: function (id, url, cache) {
      ds.define(id, {
        cache: cache,
        url: APIURL + url,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        decoder: function ( data, status, xhr, success, error ) {
          if ( status === "success" ) {
            success( data, xhr );
          } else if ( status === "fail" || status === "error" ) {
            error( JSON.parse(xhr.responseText) );
          } else if ( status === "abort") {

          } else {
            error( JSON.parse(xhr.responseText) );
          }
        }
      });
    },

  });

  return new LandsatService();

});
