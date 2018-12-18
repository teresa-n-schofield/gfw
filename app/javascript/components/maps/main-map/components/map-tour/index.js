import { connect } from 'react-redux';

import { setMainMapSettings } from 'components/maps/main-map/actions';
import { setMapSettings } from 'components/maps/map/actions';
import { setMenuSettings } from 'components/maps/components/menu/menu-actions';
import * as actions from './actions';
import Component from './component';

import reducers, { initialState } from './reducers';
import { getMapTourProps } from './selectors';

export const reduxModule = { actions, reducers, initialState };
export default connect(getMapTourProps, {
  ...actions,
  setMainMapSettings,
  setMenuSettings,
  setMapSettings
})(Component);