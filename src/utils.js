// @flow
import React from 'react';
import { type Store } from 'redux';
import { defaultTranslateOptions } from './localize';
import type { TranslatePlaceholderData, TranslatedLanguage, Translations, InitializeOptions, LocalizedElement, Language } from './localize';

export const getLocalizedElement = (translation: string, data: TranslatePlaceholderData, renderInnerHtml: boolean, onMissingTranslation: Function): LocalizedElement => {
  const localizedString = translation || onMissingTranslation();
  const translatedValue = templater(localizedString, data)
  return renderInnerHtml === true && hasHtmlTags(translatedValue)
    ? React.createElement('span', { dangerouslySetInnerHTML: { __html: translatedValue }})
    : translatedValue;
};

export const hasHtmlTags = (value: string): boolean => {
  const pattern = /(&[^\s]*;|<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[\^'">\s]+))?)+\s*|\s*)\/?>)/;
  return value.search(pattern) >= 0;
};

/**
 * @func templater
 * @desc A poor mans template parser 
 * @param {string} strings The template string
 * @param {object} data The data that should be inserted in template
 * @return {string} The template string with the data merged in
 */
export const templater = (strings: string, data: Object = {}): string => {
  for(let prop in data) {
    const pattern = '\\${\\s*'+ prop +'\\s*}';
    const regex = new RegExp(pattern, 'gmi');
	  strings = strings.replace(regex, data[prop]);  	 	
  }
  return strings;
};

export const getIndexForLanguageCode = (code: string, languages: Language[]): number => {
  return languages.map(language => language.code).indexOf(code);
};

export const objectValuesToString = (data: Object): string => {
  return !Object.values
    ? Object.keys(data).map(key => data[key].toString()).toString()
    : Object.values(data).toString();
};

export const validateOptions = (options: InitializeOptions): InitializeOptions => {
  if (options.translationTransform !== undefined && typeof options.translationTransform !== 'function') {
    throw new Error('react-localize-redux: an invalid translationTransform function was provided.');
  }

  if (options.onMissingTranslation !== undefined && typeof options.onMissingTranslation !== 'function') {
    throw new Error('react-localize-redux: an invalid onMissingTranslation function was provided.');
  }

  return options;
};

export const getTranslationsForLanguage = (language: Language, languages: Language[], translations: Translations): TranslatedLanguage => {
  // no language! return no translations 
  if (!language) {
    return {};
  }

  const { code: languageCode } = language;
  const languageIndex = getIndexForLanguageCode(languageCode, languages);
  return Object.keys(translations).reduce((prev, key) => {
    return {
      ...prev,
      [key]: translations[key][languageIndex]
    }
  }, {});
};

export const storeDidChange = (store: Store<any, any>, onChange: (prevState: any) => void) => {
  let currentState;

  function handleChange() {
    const nextState = store.getState();
    if (nextState !== currentState) {
      onChange(currentState);
      currentState = nextState;
    }
  }

  const unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
}

// Thanks react-redux for utility function
// https://github.com/reactjs/react-redux/blob/master/src/utils/warning.js
export const warning = (message: string) => {
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message)
  }

  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message)
  } catch (e) {}
}