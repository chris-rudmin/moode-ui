import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import AlbumThumb from './components/AlbumThumb';

class AlbumView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      albums: [
        {
          album: 'test',
          artist: 'testing'
        }
      ],
      genres: [],
      artists: [],
      tracks: [],
    };
  }

  render() {
    const albumThumbs = this.state.albums.map(album => {
      const albumKey = `${album.album}@${album.artist}`;
      return <AlbumThumb album={album} key={albumKey}/>
    });

    return (
      <div>
        {albumThumbs}
      </div>
    );
  }
}

ReactDOM.render(<AlbumView />, document.getElementById('root'));
