import React from 'react';
import { initialize, addTranslation, LocalizeContext, setActiveLanguage } from 'react-localize-redux';
import { Article } from './Article';

export class Main extends React.Component {

  constructor(props) {
    super(props);

    const json = require('../assets/global.locale.json');

    this.props.dispatch(initialize([
      { name: 'English', code: 'en' }, 
      { name: 'French', code: 'fr' }, 
      { name: 'Spanish', code: 'es' }
    ]));

    this.state = {
      style: {
        backgroundColor: 'red'
      }
    }

    
    this.props.dispatch(addTranslation(json));

    setTimeout(() => {

      // this.setState({
      //   style: { backgroundColor: 'yellow' }
      // });

      this.props.dispatch(setActiveLanguage('fr'));


    }, 3000);
  }

  render() {
    return (
      <div>
        <h1 style={this.state.style}>Hello</h1>

        <Article />
      </div>
    );
  }
}