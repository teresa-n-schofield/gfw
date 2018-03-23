import React from 'react';
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
  Object.keys(LANGUAGES).forEach((lang) => {
    addLocaleData(LANGUAGES[lang]);
  });
}

export default function withIntl(Page) {
  const IntlPage = injectIntl(Page);

  return class PageWithIntl extends React.Component {
    constructor() {
      super();
      this.state = {
        lang: 'en'
      }
    }

    componentDidMount() {
      Transifex.live.onTranslatePage((language_code) => {
        this.setState({ lang: language_code });
      });
    }

    render() {
      console.log('intl', this.props);
      return (
        <IntlProvider
          locale="en"
          messages={MESSAGES['en']}
          defaultLocale="en"
        >
          <IntlPage {...this.props} />
        </IntlProvider>
      );
    }
  };
}
