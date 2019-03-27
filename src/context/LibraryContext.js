import React from "react";

const { Provider, Consumer } = React.createContext({});

default export class LibraryProvider extends Component {
  state = {
    albums: [],
    genres: [],
    artists: [],
  }

  render() {
    return <Provider value={{
          state: this.state,
          actions: {
            addTrack: () => this.setState({ albums: [...this.state.albums] });
          }
        }}>
      {this.props.children}
    </Provider>
  }
}

export class LibraryConsumer extends Component {
  render() {
    return <Consumer>
      {this.props.children}
    </Consumer>
  }
}
