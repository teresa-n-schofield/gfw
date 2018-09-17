import { connectRoutes, NOT_FOUND, redirect } from 'redux-first-router';
import createHistory from 'history/createBrowserHistory';
import { handlePageTrack } from 'utils/analytics';
import { decodeUrlForState, encodeStateForUrl } from 'utils/stateToUrl';

const history = createHistory();

export const ABOUT = 'location/ABOUT';
export const SGF = 'location/SGF';
export const MAP = 'location/MAP';
export const DASHBOARDS = 'location/DASHBOARDS';
export const WIDGET_EMBED = 'location/WIDGET_EMBED';

const routeChangeThunk = (dispatch, getState) => {
  // track page with GA
  handlePageTrack(getState().location);
};

export const routes = {
  [ABOUT]: {
    path: '/about',
    component: 'about',
    sections: [
      {
        label: 'GFW in Action',
        anchor: 'gfw-in-action',
        component: 'how'
      },
      {
        label: 'Impacts',
        anchor: 'impacts',
        component: 'impacts'
      },
      {
        label: 'History',
        anchor: 'history',
        component: 'history'
      },
      {
        label: 'Contact Us',
        anchor: 'contact',
        component: 'contact'
      },
      {
        label: 'Partnership',
        anchor: 'partnership',
        component: 'partners'
      }
    ]
  },
  [SGF]: {
    path: '/small-grants-fund/:tab?',
    component: 'sgf',
    sections: {
      projects: {
        label: 'Projects',
        submenu: true,
        component: 'projects',
        path: '/small-grants-fund'
      },
      about: {
        label: 'About',
        submenu: true,
        component: 'about',
        path: '/small-grants-fund/about'
      },
      apply: {
        label: 'Apply',
        submenu: true,
        component: 'apply',
        path: '/small-grants-fund/apply'
      }
    }
  },
  [MAP]: {
    path: '/v2/map/:tab?/:country?/:region?/:subRegion?',
    component: 'map',
    headerOptions: {
      fullScreen: true,
      showPanel: true,
      fixed: true,
      toggle: true
    }
  },
  [DASHBOARDS]: {
    path: '/dashboards/:type?/:country?/:region?/:subRegion?',
    component: 'dashboards'
  },
  [WIDGET_EMBED]: {
    path: '/embed/dashboards/:type?/:country?/:region?/:subRegion?',
    component: 'dashboards/embed'
  },
  [NOT_FOUND]: {
    path: '/404',
    thunk: dispatch => dispatch(redirect({ type: MAP }))
  }
};

export default connectRoutes(history, routes, {
  querySerializer: {
    parse: decodeUrlForState,
    stringify: encodeStateForUrl
  },
  onAfterChange: routeChangeThunk
});