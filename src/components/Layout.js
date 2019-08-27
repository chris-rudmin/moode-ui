import React, { PureComponent } from 'react';
import styled from 'styled-components';
import AlbumGrid from './AlbumGrid';
import Header from './Header';
import Player from './Player';

const App = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
`;

class Layout extends PureComponent {
  render() {
    return (
      <App data-testid="app">
        <Header />
        <AlbumGrid />
        <Player />
      </App>
    );
  }
}

export default Layout;
