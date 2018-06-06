import { connect } from 'react-redux';
import { createElement, PureComponent } from 'react';

import Component from './dynamic-sentence-component';

class DynamicSentence extends PureComponent {
  componentDidMount() {
    window.Transifex.live.onReady(() => {
      this.render();
    });
  }

  render() {
    return createElement(Component, {
      ...this.props
    });
  }
}

export default connect(null, null)(DynamicSentence);
