/**
 * The Forest2000 layer module for use on canvas.
 *
 * @return ForestLayer class (extends CanvasLayerClass)
 */
define(
  [
    'd3',
    'uri',
    'abstract/layer/CanvasLayerClass',
    'map/presenters/layers/Forest2000LayerPresenter'
  ],
  (d3, UriTemplate, CanvasLayerClass, Presenter) => {
    const Forest2000Layer = CanvasLayerClass.extend({
      options: {
        threshold: 30,
        dataMaxZoom: 12,
        urlTemplate:
          'https://earthengine.google.org/static/hansen_2014/gfw_loss_tree_year_{threshold}_2014{/z}{/x}{/y}.png'
      },

      init(layer, options, map) {
        this.presenter = new Presenter(this);
        this._super(layer, options, map);
        this.threshold = options.threshold || this.options.threshold;
      },

      /**
       * Filters the canvas imgdata.
       * @override
       */
      filterCanvasImgdata(imgdata, w, h) {
        const components = 4;
        const zoom = this.map.getZoom();
        const exp = zoom < 11 ? 0.3 + (zoom - 3) / 20 : 1;

        const myscale = d3.scale
          .pow()
          .exponent(exp)
          .domain([0, 256])
          .range([0, 256]);

        for (let i = 0; i < w; ++i) {
          for (let j = 0; j < h; ++j) {
            const pixelPos = (j * w + i) * components;
            const intensity = imgdata[pixelPos + 1];

            imgdata[pixelPos] = 151;
            imgdata[pixelPos + 1] = 189;
            imgdata[pixelPos + 2] = 61;

            imgdata[pixelPos + 3] =
              zoom < 13 ? myscale(intensity) * 0.8 : intensity * 0.8;
          }
        }
      },

      setThreshold(threshold) {
        this.threshold = threshold;
        this.presenter.updateLayer();
      },

      _getUrl(x, y, z) {
        return new UriTemplate(this.options.urlTemplate).fillFromObject({
          x,
          y,
          z,
          threshold: this.threshold
        });
      }
    });

    return Forest2000Layer;
  }
);
