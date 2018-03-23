import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { format as numFormat } from 'd3-format';

import './widget-dynamic-sentence-styles.scss';

class WidgetDynamicSentence extends PureComponent {
  render() {
    const { className, widget, data, intl, sentence } = this.props;
    let formattedSentence = sentence;
    if (data) {
      const { id, values } = data;
      const parsedValues = {};
      Object.keys(values).forEach(k => {
        const { value, format, sentenceType } = values[k];
        parsedValues[k] = `<b>${format ? numFormat(format)(value) : value}</b>`
      });
      formattedSentence = intl.formatMessage({
        id
      }, parsedValues);
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
