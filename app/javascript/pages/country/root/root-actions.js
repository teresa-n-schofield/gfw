import { createAction } from 'redux-actions';

const setFixedMapStatus = createAction('setFixedMapStatus');
const setMapTop = createAction('setMapTop');
const setShowMapMobile = createAction('setShowMapMobile');
const setLang = createAction('setLang');

export default {
  setFixedMapStatus,
  setMapTop,
  setShowMapMobile,
  setLang
};
