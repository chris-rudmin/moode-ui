import React from 'react';
import ReactDOM from 'react-dom';


class App extends React.Component {
  render() {
    return (
      <div data-test-id='app'>
        Hello World
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
