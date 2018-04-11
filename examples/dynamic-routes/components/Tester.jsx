import React from 'react';
import { withLocalize } from 'react-localize-redux';

const Wrapper = props => {
  console.log('props', props);
  return (
    <h2>Wrapper</h2>
  );
};

const WrappedWithLocalize = withLocalize(Wrapper);

const Tester = props => (
  <div>
    <h1>Testing</h1>
    <WrappedWithLocalize name="Ryan" />
  </div>
)

// const Test = withLocalize(Tester);


export default Tester;