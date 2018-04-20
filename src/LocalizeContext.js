// @flow
import React from 'react';
import createReactContext, { type Context } from 'create-react-context';
import { type TranslateFunction, type Language, type MultipleLanguageTranslation, type NamedLanguage, type InitializeOptions, type SingleLanguageTranslation } from './localize';
import { createSelector, type Selector } from 'reselect';

import { localizeReducer, getTranslate, initialize, addTranslation, addTranslationForLanguage, setActiveLanguage, getLanguages, getActiveLanguage, getOptions, getTranslationsForActiveLanguage, type LocalizeState, type Action } from './localize';
// import { type initialize, type addTranslation, type addTranslationForLanguage, type setActiveLanguage } from './index';

export type LocalizeContextProps = {
  translate: TranslateFunction,
  languages: Language[],
  activeLanguage: Language,
  defaultLanguage: string,
  initialize: (languages: Array<string|NamedLanguage>, options?: InitializeOptions) => void,
  addTranslation: (translation: MultipleLanguageTranslation) => void,
  addTranslationForLanguage: (translation: SingleLanguageTranslation, language: string) => void,
  setActiveLanguage: (languageCode: string) => void
};

const dispatchInitialize = (dispatch: Function) => (languages: Array<string|NamedLanguage>, options?: InitializeOptions) => {
  return dispatch(initialize(languages, options));
};

const dispatchAddTranslation = (dispatch: Function) => (translation: MultipleLanguageTranslation) => {
  return dispatch(addTranslation(translation));
};

const dispatchAddTranslationForLanguage = (dispatch: Function) => (translation: SingleLanguageTranslation, language: string) => {
  return dispatch(addTranslationForLanguage(translation, language));
};

const dispatchSetActiveLanguage = (dispatch: Function) => (languageCode: string) => {
  return dispatch(setActiveLanguage(languageCode));
};

// getContextPropsSelector: Selector<LocalizeState, void, LocalizeContextProps>;

export const getContextPropsFromState = (dispatch: Function): Selector<LocalizeState, void, LocalizeContextProps> => createSelector(
  getTranslate,
  getLanguages,
  getActiveLanguage,
  getOptions,
  (translate, languages, activeLanguage, options) => {
    const defaultLanguage = options.defaultLanguage || (languages[0] && languages[0].code);
    return {
      translate,
      languages,
      defaultLanguage,
      activeLanguage,
      initialize: dispatchInitialize(dispatch),
      addTranslation: dispatchAddTranslation(dispatch),
      addTranslationForLanguage: dispatchAddTranslationForLanguage(dispatch),
      setActiveLanguage: dispatchSetActiveLanguage(dispatch)
    };
  }
);

const defaultLocalizeState = localizeReducer(undefined, ({}: any));
const defaultContext = getContextPropsFromState(() => {})(defaultLocalizeState);

export const LocalizeContext: Context<LocalizeContextProps> = createReactContext(defaultContext);