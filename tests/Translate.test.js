import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Map } from 'immutable';
import { localizeReducer, getTranslate, getLanguages, getActiveLanguage } from '../src';
import { defaultTranslateOptions } from '../src/localize';

Enzyme.configure({ adapter: new Adapter() });

beforeEach(() => {
  jest.resetModules();
});

describe('<Translate />', () => {
  const initialState = {
    languages: [
      { code: 'en', active: true },
      { code: 'fr', active: false }
    ],
    translations: {
      hello: ['Hello', 'Hello FR'],
      bye: ['Goodbye', 'Goodbye FR'],
      html: ['Hey <a href="http://google.com">google</a>', ''],
      multiline: [null, ''],
      placeholder: ['Hey ${name}!', '']
    },
    options: defaultTranslateOptions
  };

  let defaultContext = {};

  const getTranslateWithContext = (state = initialState) => {
    const localizeState = localizeReducer(state, {});

    defaultContext = {
      translate: getTranslate(localizeState),
      languages: getLanguages(localizeState),
      defaultLanguage: state.options.defaultLanguage || getLanguages(localizeState)[0].code,
      activeLanguage: getActiveLanguage(localizeState),
      initialize: jest.fn(),
      addTranslation: jest.fn(),
      addTranslationForLanguage: jest.fn(),
      setActiveLanguage: jest.fn()
    };

    jest.doMock('../src/LocalizeContext', () => {
      return {
        LocalizeContext: {
          Consumer: (props) => props.children(defaultContext)
        }
      }
    });
    
    return require('Translate').Translate;
  };

  it('should render HTML in translations when renderInnerHtml = true', () => {
    const Translate = getTranslateWithContext();
    const wrapper = mount(
      <Translate id="html" options={{ renderInnerHtml: true }}>Hey <a href="http://google.com">google</a></Translate>
    );

    expect(wrapper.html()).toEqual('<span>Hey <a href="http://google.com">google</a></span>')
  });

  it('should render HTML text in translations when renderInnerHtml = false', () => {
    const Translate = getTranslateWithContext();
    const wrapper = mount(
      <Translate id="html" options={{ renderInnerHtml: false }}>Hey <a href="http://google.com">google</a></Translate>
    );

    expect(() => wrapper.html()).toThrowError();
    expect(wrapper.text()).toEqual('Hey <a href="http://google.com">google</a>');
  });

  it('should convert <Translate>\'s children to a string when multi-line HTML markup is provided', () => {
    const Translate = getTranslateWithContext();
    const wrapper = mount(
      <Translate id="multiline">
        <h1>Heading</h1>
        <ul>
          <li>Item #1</li>
        </ul>
      </Translate>
    );

    expect(defaultContext.addTranslationForLanguage).toHaveBeenLastCalledWith(
      {"multiline": "<h1>Heading</h1><ul><li>Item #1</li></ul>"}, 
      "en"
    );
  });

  it('should add <Translate>\'s children to translations under languages[0].code for id', () => {
    const Translate = getTranslateWithContext();
    const wrapper = mount(<Translate id="hello">Hey</Translate>);

    expect(defaultContext.addTranslationForLanguage).toHaveBeenLastCalledWith(
      {"hello": "Hey"}, 
      "en"
    );
  });

  it('should add <Translate>\'s children to translations under options.defaultLanguage for id', () => {
    const Translate = getTranslateWithContext({ 
      ...initialState, 
      options: {
        ...initialState.options,
        defaultLanguage: 'fr'
      }
    });
    const wrapper = mount(<Translate id="hello">Hey</Translate>);
    
    expect(defaultContext.addTranslationForLanguage).toHaveBeenLastCalledWith(
      {"hello": "Hey"}, 
      "fr"
    );
  });

  it('should not override default language translation if no children provided', () => {
    const Translate = getTranslateWithContext();
    const wrapper = mount(<Translate id="hi" />);
    expect(defaultContext.addTranslationForLanguage).not.toHaveBeenCalled();
  });

  it('should not add default language translation if ignoreTranslateChildren = true', () => {
    const Translate = getTranslateWithContext();
    const wrapper = mount(<Translate id="hello" options={{ignoreTranslateChildren: true}}>Hey</Translate>);
    expect(defaultContext.addTranslationForLanguage).not.toHaveBeenCalled();
  });
  
  it('should insert data into translation placeholders when data attribute is provided', () => {
    const Translate = getTranslateWithContext();
    const wrapper = mount(
      <Translate id="placeholder" data={{name: 'Ted'}}>{'Hey ${name}!'}</Translate>
    );

    expect(wrapper.text()).toEqual('Hey Ted!');
  });

  it('should override defaultLanguage option for <Translate/>', () => {
    const Translate = getTranslateWithContext();
    const wrapper = mount(
      <Translate id="hello" options={{defaultLanguage: 'fr'}}>Hey</Translate>
    );
    expect(wrapper.text()).toEqual('Hello FR');
  });

  it('should override missingTranslationMsg option for <Translate/>', () => {
    const Translate = getTranslateWithContext();
    const options = {
      defaultLanguage: 'fr',
      missingTranslationMsg: 'Nope!'
    };
    const wrapper = mount(
      <Translate id="nope" options={options}>Hey</Translate>
    );
    expect(wrapper.text()).toEqual('Nope!');
  });

  it('should override missingTranslationCallback option for <Translate/>', () => {
    const Translate = getTranslateWithContext();
    const callback = jest.fn();
    const options = {
      defaultLanguage: 'fr',
      missingTranslationCallback: callback
    };
    const wrapper = mount(
      <Translate id="nope" options={options}>Hey</Translate>
    );
    expect(callback).toHaveBeenCalled();
  });

  

  it('should accept function as child, and pass context as argument', () => {
    const Translate = getTranslateWithContext();
    const wrapper = mount(
      <Translate>
        {context => 
          <h1>
            {context.translate('hello')} 
            {context.activeLanguage.code} 
            {context.languages.map(lang => lang.code).toString()}
          </h1>
        }
      </Translate>
    );

    expect(wrapper.text()).toEqual('Helloenen,fr');
  });
});