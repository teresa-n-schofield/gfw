export const initialState = {
  lang: ''
};

const setLang = (state, { payload }) => ({
  ...state,
  lang: payload
});

export default {
  setLang
};
