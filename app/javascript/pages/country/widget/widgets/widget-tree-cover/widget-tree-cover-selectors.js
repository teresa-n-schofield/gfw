import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { getColorPalette } from 'utils/data';
import { format } from 'd3-format';

// get list data
const getData = state => state.data;
const getSettings = state => state.settings;
const getLocationNames = state => state.locationNames;
const getActiveIndicator = state => state.activeIndicator;
const getIndicatorWhitelist = state => state.whitelist;
const getColors = state => state.colors;

// get lists selected
export const getTreeCoverData = createSelector(
  [getData, getSettings, getIndicatorWhitelist, getColors],
  (data, settings, whitelist, colors) => {
    if (isEmpty(data) || isEmpty(whitelist)) return null;
    const { totalArea, cover, plantations } = data;
    const { indicator } = settings;
    const hasPlantations = Object.keys(whitelist).indexOf('plantations') > -1;
    const colorRange = getColorPalette(colors.ramp, hasPlantations ? 2 : 1);
    const parsedData = [
      {
        label:
          hasPlantations && indicator === 'gadm28'
            ? 'Natural Forest'
            : 'Tree cover',
        value: cover - plantations,
        color: colorRange[0],
        percentage: (cover - plantations) / totalArea * 100
      },
      {
        label: 'Non-Forest',
        value: totalArea - cover,
        color: colors.nonForest,
        percentage: (totalArea - cover) / totalArea * 100
      }
    ];
    if (indicator === 'gadm28' && hasPlantations) {
      parsedData.splice(1, 0, {
        label: 'Tree plantations',
        value: plantations,
        color: colorRange[1],
        percentage: plantations / totalArea * 100
      });
    }
    return parsedData;
  }
);

export const getSentenceParams = createSelector(
  [getData, getSettings, getLocationNames, getActiveIndicator],
  (data, settings, locationNames, indicator) => {
    if (!data) return null;
    const { cover } = data;
    const locationLabel = locationNames.current && locationNames.current.label;
    return {
      year: {
        value: settings.extentYear
      },
      location: {
        value: locationLabel
      },
      subLocation: {
        value: indicator.label
      },
      extent: {
        value: cover,
        format: '.3s'
      },
      sentenceType: indicator.value === 'gadm28' ? 'default' : 'withLocation'
    };
  }
);
