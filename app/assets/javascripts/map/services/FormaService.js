define(['Class', 'uri', 'bluebird', 'map/services/DataService'], (
  Class,
  UriTemplate,
  Promise,
  ds
) => {
  const GET_TILE_URL_ID = 'FormaService:getTilesUrl';
  const GET_TILE_URL = 'https://api-dot-forma-250.appspot.com/tiles/latest';
  const GET_DATES_ID = 'FormaService:getDates';
  const GET_DATES_URL = 'https://api.forma-250.appspot.com/dates';

  const FormaService = Class.extend({
    getTileUrl() {
      return new Promise(
        ((resolve, reject) => {
          this.defineRequest(GET_TILE_URL_ID, GET_TILE_URL, {
            type: 'persist',
            duration: 1,
            unit: 'days'
          });

          const requestConfig = {
            resourceId: GET_TILE_URL_ID,
            success(res, status) {
              resolve(res, status);
            },
            error(errors) {
              reject(errors);
            }
          };

          ds.request(requestConfig);
        })
      );
    },

    getDates() {
      return new Promise(
        ((resolve, reject) => {
          this.defineRequest(GET_DATES_ID, GET_DATES_URL, {
            type: 'persist',
            duration: 1,
            unit: 'days'
          });

          const requestConfig = {
            resourceId: GET_DATES_ID,
            success(res, status) {
              resolve(res, status);
            },
            error(errors) {
              reject(errors);
            }
          };

          ds.request(requestConfig);
        })
      );
    },

    defineRequest(id, url, cache) {
      ds.define(id, {
        cache: false,
        url,
        type: 'GET',
        dataType: 'json',
        decoder(data, status, xhr, success, error) {
          if (status === 'success') {
            success(data, xhr);
          } else if (status === 'fail' || status === 'error') {
            error(xhr.statusText);
          } else if (status !== 'abort') {
            error(xhr.statusText);
          }
        }
      });
    }
  });

  return new FormaService();
});
