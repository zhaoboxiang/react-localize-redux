import { ReactElement, ReactNode, Component as ReactComponent  } from 'react';
import { Store } from 'redux';
import { ComponentClass, Component } from 'react-redux';

export as namespace ReactLocalizeRedux;

export interface Language {
  name?: string;
  code: string;
  active: boolean;
}

export interface NamedLanguage {
  name: string;
  code: string;
}

export interface Translations {
  [key: string]: string[];
}

type TransFormFunction = (data: Object, languageCodes: string[]) => Translations;

type MissingTranslationCallback = (key: string, languageCode: string) => any;

export interface Options {
  renderInnerHtml?: boolean;
  defaultLanguage?: string;
  missingTranslationMsg?: string;
  missingTranslationCallback?: MissingTranslationCallback;
  translationTransform?: TransFormFunction;
  ignoreTranslateChildren?: boolean;
}

export interface LocalizeState {
  languages: Language[];
  translations: Translations;
  options: Options;
}

export interface LocalizeContextProps {
  translate: TranslateFunction,
  languages: Language[],
  activeLanguage: Language,
  defaultLanguage: string,
  initialize: (languages: Array<string|NamedLanguage>, options?: Options) => void,
  addTranslation: (translation: MultipleLanguageTranslation) => void,
  addTranslationForLanguage: (translation: SingleLanguageTranslation, language: string) => void,
  setActiveLanguage: (languageCode: string) => void
}

export interface LocalizeProviderProps {
  store?: Store<any>,
  children: any
}

export interface TranslatedLanguage {
  [key: string]: string;
}

export type LocalizedElement = ReactElement<'span'>|string;

export interface LocalizedElementMap {
  [key: string]: LocalizedElement;
}

export interface TranslatePlaceholderData {
  [key: string]: string|number;
}

export type TranslateChildFunction = (context: LocalizeContextProps) => any;

export interface TranslateProps {
  id?: string;
  options?: Options;
  data?: TranslatePlaceholderData;
  children?: any|TranslateChildFunction;
}

export type TranslateValue = string|string[];
 
interface BaseAction<T, P> {
  type: T;
  payload: P;
}

export type TranslateFunction = (value: TranslateValue, data?: TranslatePlaceholderData, options?: Options) => LocalizedElement|LocalizedElementMap; 

type InitializePayload = {
  languages: any[], 
  options?: Options
};

type AddTranslationPayload = {
  translation: Object
};

type AddTranslationForLanguagePayload = {
  translation: Object,
  language: string
};

type SetActiveLanguagePayload = {
  languageCode: string
};

export type SingleLanguageTranslation = {
  [key: string]: Object | string
};

export type MultipleLanguageTranslation = {
  [key: string]: Object | string[]
};

export type InitializeAction = BaseAction<'@@localize/INITIALIZE', InitializePayload>;
export type AddTranslationAction = BaseAction<'@@localize/ADD_TRANSLATION', AddTranslationPayload>;
export type AddTranslationForLanguageAction = BaseAction<'@@localize/ADD_TRANSLATION_FOR_LANGUAGE', AddTranslationForLanguagePayload>;
export type SetActiveLanguageAction = BaseAction<'@@localize/SET_ACTIVE_LANGUAGE', SetActiveLanguagePayload>;

export type Action = BaseAction<
  string, 
  & InitializePayload
  & AddTranslationPayload 
  & AddTranslationForLanguagePayload 
  & SetActiveLanguagePayload
>;

export type ActionLanguageCodes = Action & { languageCodes: string[] };

export function localizeReducer(state: LocalizeState, action: Action): LocalizeState;

export function initialize(languages: Array<string|NamedLanguage>, options?: Options): InitializeAction;

export function addTranslation(translation: MultipleLanguageTranslation): AddTranslationAction;

export function addTranslationForLanguage(translation: SingleLanguageTranslation, language: string): AddTranslationForLanguageAction;

export function setActiveLanguage(languageCode: string): SetActiveLanguageAction;

export function getTranslations(state: LocalizeState): Translations;

export function getLanguages(state: LocalizeState): Language[];

export function getOptions(state: LocalizeState): Options;

export function getActiveLanguage(state: LocalizeState): Language;

export function getTranslate(state: LocaleState): TranslateFunction;

export function withLocalize<Props>(WrappedComponent: Component<Props>): Component<Props & LocalizeContextProps>;

export function TranslateChildFunction(context: LocalizeContextProps): ReactNode;

export default class Translate extends ReactComponent<TranslateProps> {}