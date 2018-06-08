define(['d3', 'underscore', 'turf', 'geojsonArea'], (
  d3,
  _,
  turf,
  geojsonArea
) => {
  const geojsonUtilsHelper = {
    /**
     * Generates a GEOJSON form a path.
     *
     * @param  {Array} path Array of google.maps.LatLng objects
     * @return {string} A GeoJSON string representing the path
     */
    pathToGeojson(path) {
      let coordinates = null;

      coordinates = _.map(path, (latlng) => [
        _.toNumber(latlng.lng().toFixed(4)),
        _.toNumber(latlng.lat().toFixed(4))
      ]);

      // First and last coordinate should be the same
      coordinates.push(_.first(coordinates));

      return {
        type: 'Polygon',
        coordinates: [coordinates]
      };
    },

    featureCollectionToFeature(geojson) {
      if (geojson.type === 'FeatureCollection') {
        return geojson.features.reduce(turf.union);
      }
      return {};
    },

    /**
     * Generates a path from a Geojson.
     *
     * @param  {object} geojson
     * @return {array} paths
     */
    geojsonToPath(geojson) {
      if (geojson.type === 'Polygon') {
        const coords = geojson.coordinates[0];
        return _.map(coords, (g) => new google.maps.LatLng(g[1], g[0]));
      } else if (geojson.type === 'MultiPolygon') {
        return geojson.coordinates.map((polygon) => polygon[0].map((coords) => new google.maps.LatLng(coords[1], coords[0])));
      } else if (geojson.type === 'FeatureCollection') {
        return this.geojsonToPath(
          this.featureCollectionToFeature(geojson).geometry
        );
      }
      return [];
    },

    /**
     * Get Bounds from the suplied geojson.
     *
     * @param  {Object} geojson Topojson object
     * @return {Object} Returns google LatLngBounds object
     */
    getBoundsFromGeojson(geojson) {
      const d3bounds = d3.geo.bounds(geojson);

      if (
        _.isNaN(d3bounds[0][1]) ||
        _.isNaN(d3bounds[0][0]) ||
        _.isNaN(d3bounds[1][1]) ||
        _.isNaN(d3bounds[1][0])
      ) {
        return null;
      }

      const a = new google.maps.LatLng(d3bounds[0][1], d3bounds[0][0]);
      const b = new google.maps.LatLng(d3bounds[1][1], d3bounds[1][0]);

      const bounds = new google.maps.LatLngBounds(a, b);
      return bounds;
    },

    /**
     * Get total hectares from a geojson.
     *
     * @param  {Object} geojson  polygon/multipolygon
     * @return {String} hectares
     */
    getHectares(geojson) {
      return Math.round(geojsonArea(geojson) / 10000).toLocaleString();
      // changed function to calculate areas in cartodb instead of using the google library

      // var area;
      // var theurl="https://wri-01.carto.com/api/v2/sql";
      // var thequery="select st_area(st_geomfromgeojson('"+JSON.stringify(geojson)+"')::geography)/10000 as area_ha";
      // $.ajax({
      //    url: theurl,
      //    data: { q: thequery} ,
      //    success: function(result) {
      //                 area= Math.round(result.rows[0].area_ha).toLocaleString();
      //             },
      //    async:   false,
      //    method: 'POST'
      // });
      // return area;
    }
  };

  return geojsonUtilsHelper;
});
