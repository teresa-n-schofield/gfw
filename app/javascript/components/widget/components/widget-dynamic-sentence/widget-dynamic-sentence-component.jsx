import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './widget-dynamic-sentence-styles.scss';

class WidgetDynamicSentence extends PureComponent {
  render() {
    const { className } = this.props;
    const { sentence, params } = this.props.sentence;
    let formattedSentence = sentence;
    if (params) {
      Object.keys(params).forEach(p => {
        formattedSentence = formattedSentence.replace(
          `{${p}}`,
          `<b>${params[p]}</b>`
        );
      });
    }

    return (
      <p
        className={`c-widget-dynamic-sentence ${className || ''}`}
        dangerouslySetInnerHTML={{ __html: formattedSentence }}
      />
    );
  }
}

WidgetDynamicSentence.propTypes = {
  className: PropTypes.string,
  sentence: PropTypes.object
};

export default WidgetDynamicSentence;
