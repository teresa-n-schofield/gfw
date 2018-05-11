import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import groupBy from 'lodash/groupBy';
import { format } from 'd3-format';
import moment from 'moment';
import { biomassToCO2 } from 'utils/calculations';
import { sortByKey, getColorPalette } from 'utils/data';

// get list data
const getLoss = state => (state.data && state.data.loss) || null;
const getExtent = state => (state.data && state.data.extent) || null;
const getSettings = state => state.settings || null;
const getCurrentLocation = state => state.currentLabel || null;
const getIndicator = state => state.indicator || null;
const getColors = state => state.colors || null;
const getSentences = state => state.config && state.config.sentences;
const getCountries = state => state.config && state.countries;

const groupData = (data, extent) => {
  const groupByYear = groupBy(data, 'year');
  const sumData = Object.keys(groupBy(data, 'year')).map(y => {
    const area = sumBy(groupByYear[y], 'area') || 0;
    const emissions = sumBy(groupByYear[y], 'emissions') || 0;
    return {
      iso: 'Other',
      year: y,
      area,
      emissions,
      percentage: (area && area / extent * 100) || 0
    };
  });
  return sumData;
};

export const getFilteredData = createSelector(
  [getLoss, getSettings],
  (data, settings) => {
    if (isEmpty(data)) return null;
    const { startYear, endYear } = settings;
    return data.filter(d => d.year >= startYear && d.year <= endYear);
  }
);

export const getTopIsos = createSelector([getFilteredData], data => {
  if (isEmpty(data)) return null;
  const datasasd = groupBy(sortByKey(data, 'area'), 'iso');
  const top = sortByKey(
    Object.keys(datasasd).map(k => ({
      iso: k,
      area: sumBy(datasasd[k], 'area')
    })),
    'area',
    true
  ).slice(0, 5);
  return top.map(d => d.iso);
});

// get lists selected
export const parseData = createSelector(
  [getFilteredData, getTopIsos],
  (data, isos) => {
    if (isEmpty(data)) return null;
    const filterData = data.filter(d => isos.indexOf(d.iso) > -1);
    const otherData = groupData(data.filter(d => isos.indexOf(d.iso) === -1));
    const allData = [...filterData, ...otherData];
    const dsada = groupBy(allData, 'year');
    const finasdsa = Object.keys(dsada).map(y => {
      const datakeys = {};
      dsada[y].forEach(d => {
        datakeys[d.iso] = d.area || 0;
      });

      return {
        year: y,
        ...datakeys
      };
    });

    return finasdsa;
  }
);

export const parseConfig = createSelector(
  [getColors, parseData, getTopIsos, getCountries],
  (colors, data, isos, countries) => {
    if (!data || !data.length) return null;
    const yKeys = {};
    const keys = [...isos, 'Other'];
    const colorRange = getColorPalette(colors.ramp, keys.length).reverse();
    keys.reverse().forEach((k, index) => {
      yKeys[k] = {
        fill: colorRange[index],
        stackId: 1
      };
    });
    let tooltip = [
      {
        key: 'year'
      }
    ];
    tooltip = tooltip.concat(
      keys
        .map((key, i) => {
          const country = countries && countries.find(c => c.value === key);
          return {
            key,
            label: (country && country.label) || 'Other',
            unit: 'ha',
            color: colorRange[i],
            unitFormat: value => format('.3s')(value)
          };
        })
        .reverse()
    );

    return {
      xKey: 'year',
      yKeys: {
        bars: yKeys
      },
      xAxis: {
        tickFormatter: tick => {
          const year = moment(tick, 'YYYY');
          if ([2001, 2016].includes(tick)) {
            return year.format('YYYY');
          }
          return year.format('YY');
        }
      },
      unit: 'ha',
      tooltip
    };
  }
);

export const getSentence = createSelector(
  [
    getFilteredData,
    getExtent,
    getSettings,
    getCurrentLocation,
    getIndicator,
    getSentences
  ],
  (data, extent, settings, currentLabel, indicator, sentences) => {
    if (!data) return null;
    const { initial, withInd } = sentences;
    const { startYear, endYear, extentYear } = settings;

    const totalLoss = (data && data.length && sumBy(data, 'area')) || 0;
    const totalEmissions =
      (data && data.length && biomassToCO2(sumBy(data, 'emissions'))) || 0;
    const percentageLoss =
      (totalLoss && extent && totalLoss / extent * 100) || 0;

    const sentence = indicator ? withInd : initial;

    const params = {
      indicator: indicator && indicator.label.toLowerCase(),
      location: currentLabel === 'global' ? 'globally' : currentLabel,
      startYear,
      endYear,
      loss: `${format('.3s')(totalLoss)}ha`,
      percent: `${format('.1f')(percentageLoss)}%`,
      emissions: `${format('.3s')(totalEmissions)}t`,
      extentYear
    };

    return {
      sentence,
      params
    };
  }
);