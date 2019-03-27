import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { LibraryProvider } from './context/LibraryContext';

class Moode extends Component {
  state = {
    albums: []
  }

  render() {
    return (
      <LibraryProvider
        value={{
          state: this.state
          actions: {
            increment: () => this.setState({ count: this.state.count + 1 }),
          }
        }}
      >
        {this.props.children}
      </LibraryProvider>
    );
  }
}

ReactDOM.render(<Moode />, document.getElementById('root'));
