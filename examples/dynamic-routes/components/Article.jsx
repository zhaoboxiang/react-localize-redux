import React from 'react';
import {LocalizeContext} from 'react-localize-redux';

export const Article = props => {

  const renderStuff = (translate) => {
    console.log('renderStuff');

    // return locale.languages.length > 0
    //   ? <h1>{translate('welcome-page')}</h1>
    //   : <p>No languages yet!</p>;
    return null;
  }

  console.log('render Article');
  
  return (
    <LocalizeContext.Consumer>
      {({ translate }) => 
        <h1>{translate('welcome-page')}</h1>
      }
    </LocalizeContext.Consumer>
  );
}