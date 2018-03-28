import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { IntlProvider, addLocaleData, injectIntl } from 'react-intl';

import langEn from 'locales/en.json';
import langFr from 'locales/fr.json';

import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';

const LANGUAGES = { en, fr };
const MESSAGES = { en: langEn, fr: langFr };

// Register React Intl's locale data for the user's locale in the browser
if (typeof window !== 'undefined') {
  Object.keys(LANGUAGES).forEach(lang => {
    addLocaleData(LANGUAGES[lang]);
  });
}

export default function withIntl(Page) {
  const IntlPage = injectIntl(Page);

  return class PageWithIntl extends PureComponent {
    static propTypes = {
      lang: PropTypes.string
    };
    render() {
      const { lang } = this.props;
      return (
        <IntlProvider
          locale={lang}
          messages={MESSAGES[lang]}
          defaultLocale="en"
        >
          <IntlPage {...this.props} />
        </IntlProvider>
      );
    }
  };
}
