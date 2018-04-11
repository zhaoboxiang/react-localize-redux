import React from 'react';
import PropTypes from 'prop-types';
import { applyMiddleware, compose, createStore, combineReducers } from 'redux';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import rootRoute from './routes';
import { localeReducer, LocalizeContext } from 'react-localize-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { LocalizeProvider } from 'react-localize-redux';
import CoreLayout from './components/CoreLayout';
import {Main} from './components/Main';

const ROOT_NODE = document.getElementById('root');

const store = createStore(combineReducers({ 
  locale: localeReducer,
  clicks: (state = 0, action) => {
    switch(action.type) {
      case 'CLICKED':
        return state + 1;
      default:
        return state;
    }
  }
}), composeWithDevTools());

// const App = props => {
//   return (
//     <Provider store={ store }>
//       <Router history={ hashHistory } routes={ rootRoute(store) } />
//     </Provider>
//   );
// };

class App extends React.Component {

  render() {
    return (
      <LocalizeProvider>
        <div>
          <LocalizeContext.Consumer>
            {({ dispatch }) => 
              <Main dispatch={dispatch} />
            }
          </LocalizeContext.Consumer>
        </div>
      </LocalizeProvider>
    );
  }
}

ReactDOM.render(<App />, ROOT_NODE);

