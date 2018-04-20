// @flow
import React, { type StatelessFunctionalComponent } from 'react';
import { withLocalize, type LocalizeContextProps } from 'react-localize-redux';
import './Main.css';

const LanguageToggle = ({languages, activeLanguage, setActiveLanguage}) => {
  const getClass = (languageCode) => {
    return languageCode === activeLanguage.code ? 'active' : ''
  };

  return (
    <ul className="selector">
      {languages.map(lang => 
        <li key={ lang.code }>
          <button className={getClass(lang.code)} onClick={() => setActiveLanguage(lang.code)}>{ lang.name }</button>        
        </li>
      )}
    </ul>
  );
};

export default withLocalize(LanguageToggle);