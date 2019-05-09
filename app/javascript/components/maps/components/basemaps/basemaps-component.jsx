/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'components/ui/dropdown';
import cx from 'classnames';
import Icon from 'components/ui/icon';
import Button from 'components/ui/button';
import { Tooltip } from 'react-tippy';
import Switch from 'components/ui/switch';

import infoIcon from 'assets/icons/info.svg';
import closeIcon from 'assets/icons/close.svg';
import arrowIcon from 'assets/icons/arrow-down.svg';

import boundariesIcon from 'assets/icons/boundaries.svg';
import labelsIcon from 'assets/icons/labels.svg';
import roadsIcon from 'assets/icons/roads.svg';

import './styles.scss';

class Basemaps extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { showBasemaps: false };
  }

  static propTypes = {
    onClose: PropTypes.func,
    boundaries: PropTypes.array,
    basemaps: PropTypes.object.isRequired,
    labels: PropTypes.object.isRequired,
    landsatYears: PropTypes.array.isRequired,
    selectLabels: PropTypes.func.isRequired,
    selectBasemap: PropTypes.func.isRequired,
    activeLabels: PropTypes.object.isRequired,
    activeBasemap: PropTypes.object.isRequired,
    selectBoundaries: PropTypes.func.isRequired,
    activeBoundaries: PropTypes.object,
    isDesktop: PropTypes.bool,
    getTooltipContentProps: PropTypes.func.isRequired,
    setModalMetaSettings: PropTypes.func,
    activeRoads: PropTypes.object.isRequired,
    selectRoads: PropTypes.func.isRequired,
    roads: PropTypes.object.isRequired,
    setMapSettings: PropTypes.func,
    planetInvertalOptions: PropTypes.array,
    planetIntervalSelected: PropTypes.object,
    planetBasemapSelected: PropTypes.object,
    planetYears: PropTypes.array,
    planetYearSelected: PropTypes.object,
    planetPeriods: PropTypes.array,
    planetPeriodSelected: PropTypes.object
  };

  state = {
    planetTooltipOpen: false
  };

  renderButtonBasemap(item) {
    const { selectBasemap, isDesktop } = this.props;

    return (
      <button
        className="basemaps-list-item-button"
        onClick={() => {
          if (!isDesktop) {
            this.setState({ showBasemaps: !this.state.showBasemaps });
          }
          selectBasemap(item);
        }}
      >
        <div
          className="basemaps-list-item-image"
          style={{
            backgroundImage: `url(${item.image})`
          }}
        />
        <p className="basemaps-list-item-name">{item.label}</p>
      </button>
    );
  }

  renderLandsatBasemap(item) {
    const { selectBasemap, activeBasemap, landsatYears, basemaps } = this.props;
    const year = activeBasemap.year || landsatYears[0].value;
    const basemap = basemaps[item.value]
      ? basemaps[item.value]
      : basemaps.landsat;

    return (
      <button
        className="basemaps-list-item-button"
        onClick={() =>
          selectBasemap({
            value: 'landsat',
            url: basemap.url.replace('{year}', basemap.defaultYear),
            year: basemap.defaultYear
          })
        }
      >
        <div
          className="basemaps-list-item-image"
          style={{
            backgroundImage: `url(${item.image})`
          }}
        />
        <span
          className="basemaps-list-item-name"
          onClick={e => e.stopPropagation()}
        >
          {item.label}
          <div className="basemaps-list-item-selectors">
            <Dropdown
              className="landsat-selector"
              theme="theme-dropdown-native-inline"
              value={year}
              options={landsatYears}
              onChange={value => {
                const selectedYear = parseInt(value, 10);
                selectBasemap({
                  value: 'landsat',
                  url: basemap.url.replace('{year}', selectedYear),
                  year: selectedYear
                });
              }}
              native
            />
          </div>
        </span>
      </button>
    );
  }

  renderPlanetBasemap(item) {
    const {
      isDesktop,
      selectBasemap,
      planetInvertalOptions,
      planetIntervalSelected,
      planetBasemapSelected,
      planetYears,
      planetYearSelected,
      planetPeriods,
      planetPeriodSelected
    } = this.props;
    const { planetTooltipOpen } = this.state;
    const { url, interval, year, period } = planetBasemapSelected || {};
    const basemap = {
      value: 'planet',
      url,
      interval,
      planetYear: year,
      period
    };

    return (
      <button
        className="basemaps-list-item-button"
        onClick={() => {
          if (!isDesktop) {
            this.setState({ showBasemaps: !this.state.showBasemaps });
          }
          selectBasemap(basemap);
        }}
      >
        <div
          className="basemaps-list-item-image"
          style={{
            backgroundImage: `url(${item.image})`
          }}
        />
        <span
          className="basemaps-list-item-name"
          onClick={e => e.stopPropagation()}
        >
          {item.label}
          <div className="basemaps-list-item-selectors">
            <Tooltip
              useContext
              theme="light"
              arrow
              interactive
              onRequestClose={() => this.setState({ planetTooltipOpen: false })}
              open={planetTooltipOpen}
              html={
                <div className="c-basemaps-tooltip">
                  <button
                    className="planet-tooltip-close"
                    onClick={() => this.setState({ planetTooltipOpen: false })}
                  >
                    <Icon icon={closeIcon} />
                  </button>
                  <Switch
                    theme="theme-switch-light"
                    label="Interval"
                    value={
                      planetIntervalSelected && planetIntervalSelected.value
                    }
                    options={planetInvertalOptions}
                    onChange={selected => {
                      const selectedInvertal = planetInvertalOptions.find(
                        f => f.value === selected
                      );
                      selectBasemap({
                        ...basemap,
                        interval: selected,
                        planetYear:
                          (selectedInvertal && selectedInvertal.year) || null,
                        url: (selectedInvertal && selectedInvertal.url) || ''
                      });
                    }}
                  />
                  <div className="date-selectors">
                    <Dropdown
                      className="year-selector"
                      label="Year"
                      theme="theme-dropdown-native"
                      value={planetYearSelected}
                      options={planetYears}
                      onChange={selected => {
                        const selectedYear = planetYears.find(
                          f => f.value === parseInt(selected, 10)
                        );
                        selectBasemap({
                          ...basemap,
                          planetYear: parseInt(selected, 10),
                          url: (selectedYear && selectedYear.url) || ''
                        });
                      }}
                      native
                    />
                    <Dropdown
                      className="period-selector"
                      label="Period"
                      theme="theme-dropdown-native"
                      value={planetPeriodSelected}
                      options={planetPeriods}
                      onChange={selected => {
                        const selectedPeriod = planetPeriods.find(
                          f => f.value === selected
                        );
                        selectBasemap({
                          ...basemap,
                          period: selected,
                          url: (selectedPeriod && selectedPeriod.url) || ''
                        });
                      }}
                      native
                    />
                  </div>
                </div>
              }
              trigger="click"
              position="top"
            >
              <button
                className="planet-label"
                onClick={() => {
                  this.setState({ planetTooltipOpen: !planetTooltipOpen });
                }}
              >
                {planetBasemapSelected && planetBasemapSelected.label}
                <Icon icon={arrowIcon} className="arrow-icon" />
              </button>
            </Tooltip>
          </div>
        </span>
      </button>
    );
  }

  renderBasemapsSelector() {
    const { activeBasemap, basemaps, isDesktop } = this.props;
    return (
      <div className="basemaps-bottom-section">
        {isDesktop ? (
          <div className="basemaps-header">
            <h2 className="basemaps-title">MAP STYLES</h2>
          </div>
        ) : (
          <div className="menu-arrow" />
        )}
        <div className="basemap-list-scroll-wrapper">
          <ul className="basemaps-list">
            {Object.values(basemaps).map(item => {
              let basemapButton = this.renderButtonBasemap(item);
              if (item.value === 'landsat') {
                basemapButton = this.renderLandsatBasemap(item);
              } else if (item.value === 'planet') {
                basemapButton = this.renderPlanetBasemap(item);
              }

              return (
                <li
                  key={item.value}
                  className={cx('basemaps-list-item', {
                    '-active': activeBasemap.value === item.value
                  })}
                >
                  {basemapButton}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }

  render() {
    const {
      onClose,
      activeLabels,
      activeBasemap,
      getTooltipContentProps,
      activeBoundaries,
      selectBoundaries,
      boundaries,
      labels,
      isDesktop,
      setModalMetaSettings
      // activeRoads,
      // selectRoads,
      // roads
    } = this.props;

    const selectedBoundaries = activeBoundaries
      ? { label: activeBoundaries.name }
      : boundaries && boundaries[0];
    return (
      <div
        className={cx('c-basemaps', 'map-tour-basemaps')}
        {...getTooltipContentProps()}
      >
        <div className="basemaps-top-section">
          <div className="basemaps-header">
            <h2 className="basemaps-title">Map settings</h2>
            {isDesktop && (
              <div className="basemaps-actions">
                <Button
                  className="info-btn"
                  theme="theme-button-tiny theme-button-grey-filled square"
                  onClick={() =>
                    setModalMetaSettings({ metakey: 'flagship_basemaps' })
                  }
                >
                  <Icon icon={infoIcon} />
                </Button>
                <button className="basemaps-action-button" onClick={onClose}>
                  <Icon icon={closeIcon} />
                </button>
              </div>
            )}
          </div>
          <ul className="basemaps-options-container">
            {!isDesktop && (
              <li className="basemaps-options-wrapper">
                <Button
                  theme="theme-button-dark-round"
                  background={`url(${activeBasemap.image})`}
                  onClick={() =>
                    this.setState({ showBasemaps: !this.state.showBasemaps })
                  }
                >
                  <span className="value">
                    {activeBasemap.label}
                    {activeBasemap.year && ` - ${activeBasemap.year}`}
                  </span>
                </Button>
              </li>
            )}
            <li className="basemaps-options-wrapper">
              <Dropdown
                theme={cx('theme-dropdown-button', {
                  'theme-dropdown-dark-round theme-dropdown-no-border': !isDesktop,
                  'theme-dropdown-dark-squared': isDesktop
                })}
                value={selectedBoundaries}
                options={boundaries}
                onChange={selectBoundaries}
                selectorIcon={boundariesIcon}
              />
            </li>
            <li className="basemaps-options-wrapper">
              <Dropdown
                theme={cx('theme-dropdown-button', {
                  'theme-dropdown-dark-round theme-dropdown-no-border': !isDesktop,
                  'theme-dropdown-dark-squared': isDesktop
                })}
                value={activeLabels}
                options={Object.values(labels)}
                onChange={this.props.selectLabels}
                selectorIcon={labelsIcon}
              />
            </li>
            <li className="basemaps-options-wrapper">
              <Dropdown
                theme={cx('theme-dropdown-button', {
                  'theme-dropdown-dark-round theme-dropdown-no-border': !isDesktop,
                  'theme-dropdown-dark-squared': isDesktop
                })}
                className="basemaps-roads"
                value={'roads'}
                options={[
                  { label: 'Roads', value: 'roads' },
                  { label: 'No roads', value: 'noroads' }
                ]}
                onChange={() => {}}
                selectorIcon={roadsIcon}
              />
            </li>
            {/* <li className="basemaps-options-wrapper">
              <Dropdown
                className="theme-dropdown-button"
                label="roads"
                value={activeRoads}
                options={Object.values(roads)}
                onChange={selectRoads}
              />
            </li> */}
          </ul>
        </div>
        {(isDesktop || this.state.showBasemaps) &&
          this.renderBasemapsSelector()}
      </div>
    );
  }
}

export default Basemaps;
