export const initialState = {
  gfwHeaderHeight: 58,
  showMapMobile: false,
  lang: 'en'
};

const setFixedMapStatus = (state, { payload }) => ({
  ...state,
  isMapFixed: payload
});

const setShowMapMobile = (state, { payload }) => ({
  ...state,
  showMapMobile: payload
});

const setLang = (state, { payload }) => ({
  ...state,
  lang: payload
});

export default {
  setFixedMapStatus,
  setShowMapMobile,
  setLang
};
