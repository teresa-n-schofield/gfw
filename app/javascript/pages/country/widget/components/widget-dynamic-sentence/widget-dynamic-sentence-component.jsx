import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { format as numFormat } from 'd3-format';

import './widget-dynamic-sentence-styles.scss';

class WidgetDynamicSentence extends PureComponent {
  render() {
    const { className, widget, params, intl, sentence } = this.props;
    const values = {};
    let formattedSentence = sentence;
    if (!formattedSentence && params) {
      Object.keys(params).forEach(k => {
        const { value, format, sentenceType } = params[k];
        values[k] = `<b>${format ? numFormat(format)(value) : value}</b>`
      });
      formattedSentence = intl.formatMessage({
        id: `widget.${widget}.${params.sentenceType}`
      }, values);
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
  sentence: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};

export default WidgetDynamicSentence;
