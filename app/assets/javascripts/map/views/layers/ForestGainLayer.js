/**
 * The ForestGain layer module for use on canvas.
 *
 * @return ForestGainLayer class (extends ImageLayerClass)
 */
define(['abstract/layer//ImageLayerClass'], (ImageLayerClass) => {
  const ForestGainLayer = ImageLayerClass.extend({
    options: {
      dataMaxZoom: 12,
      urlTemplate:
        'https://earthengine.google.org/static/hansen_2013/gain_alpha{/z}{/x}{/y}.png'
    }
  });

  return ForestGainLayer;
});
