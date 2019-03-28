import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import AlbumThumb from './components/AlbumThumb';
import oboe from 'oboe';

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

  componentDidMount() {
    oboe({
       url: 'http://dev-moode.local/command/moode.php?cmd=loadlib',
       method: 'POST',
    }).node('!.*', track => {
      this.setState((state, props) => {
        return {
          albums: [],
          genres: [],
          artists: [],
          tracks: state.tracks.concat(track)
        };
      });
    });
  }

  render() {
    const albumThumbs = this.state.albums.map(album => {
      const albumKey = `${album.album}@${album.artist}`;
      return (<AlbumThumb album={album} key={albumKey}/>);
    });

    return (
      <div>
        {albumThumbs}
      </div>
    );
  }
}

ReactDOM.render(<AlbumView />, document.getElementById('root'));
