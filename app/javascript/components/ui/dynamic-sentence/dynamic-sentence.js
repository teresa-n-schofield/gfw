import { connect } from 'react-redux';
import { createElement, PureComponent } from 'react';

import Component from './dynamic-sentence-component';

class DynamicSentence extends PureComponent {
  // componentWillReceiveProps() {
  //   const strings = document.getElementsByClassName('notranslate');
  //   console.log(strings);
  //   if (strings && strings.length) {
  //     Array.from(strings).forEach(el => {
  //       window.Transifex && window.Transifex.live.translateText(el);
  //     });
  //   }
  // }

  render() {
    return createElement(Component, {
      ...this.props
    });
  }
}

export default connect(null, null)(DynamicSentence);
