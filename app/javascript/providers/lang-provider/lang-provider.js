import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from './lang-provider-actions';
import reducers, { initialState } from './lang-provider-reducers';

class LangProvider extends PureComponent {
  componentWillMount() {
    const { setLang } = this.props;
    const lang = localStorage.getItem('txlive:selectedlang');
    setLang((lang && lang.replace(/['"]+/g, '')) || 'en');
  }

  componentWillReceiveProps(nextProps) {
    const { setLang } = nextProps;
    window.Transifex.live.onTranslatePage(lang => {
      setLang(lang);
    });
  }

  render() {
    return null;
  }
}

LangProvider.propTypes = {
  setLang: PropTypes.func.isRequired
};

export { actions, reducers, initialState };
export default connect(null, actions)(LangProvider);
