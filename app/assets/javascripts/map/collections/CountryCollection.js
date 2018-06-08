define(['backbone', 'underscore'], (Backbone, _) => {
  const CountryCollection = Backbone.Collection.extend({
    url:
      'https://wri-01.carto.com/api/v2/sql?q=SELECT c.iso, c.name FROM gfw2_countries c WHERE c.enabled = true ORDER BY c.name',

    parse(response) {
      return response.rows;
    }
  });

  return CountryCollection;
});
