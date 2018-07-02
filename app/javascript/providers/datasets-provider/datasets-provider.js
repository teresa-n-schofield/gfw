import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from './datasets-provider-actions';
import reducers, { initialState } from './datasets-provider-reducers';

const mapStateToProps = ({ location }) => ({
  location: location.payload
});

class DatasetsProvider extends PureComponent {
  componentDidMount() {
    const { getDatasets } = this.props;
    getDatasets();
  }

  render() {
    return null;
  }
}

DatasetsProvider.propTypes = {
  getDatasets: PropTypes.func.isRequired
};

export { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(DatasetsProvider);