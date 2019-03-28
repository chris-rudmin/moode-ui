import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import oboe from 'oboe';
import AlbumThumb from './components/AlbumThumb';
import md5 from 'md5';

class AlbumView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      albums: {},
      isLoading: true
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const nextStateAlbumLength = Object.keys(nextState.albums).length;
    const thisStateAlbumLength = Object.keys(this.state.albums).length
    return !(nextState.isLoading && (nextStateAlbumLength > 1000 || nextStateAlbumLength === thisStateAlbumLength));
  }

  componentDidMount() {
    oboe({
      url: 'http://dev-moode.local/command/moode.php?cmd=loadlib',
      method: 'POST',
    }).node('!.*', track => this.setState((state, props) => {
      const artist = track.album_artist || track.artist;
      const albumKey = `${track.album}@${artist}`;

      track.last_modified = new Date(track.last_modified);
      state.albums[albumKey] = state.albums[albumKey] || {};
      state.albums[albumKey].tracks =  state.albums[albumKey].tracks || []

      const thisAlbum = state.albums[albumKey];
      thisAlbum.tracks.push(track);
      thisAlbum.title = thisAlbum.title || track.album;
      thisAlbum.artist = thisAlbum.artist || artist;
      thisAlbum.genre = thisAlbum.genre || track.genre;
      thisAlbum.last_modified = new Date(Math.max.apply(null, thisAlbum.tracks.map(track => track.last_modified )));
      thisAlbum.year = thisAlbum.year || track.year;
      thisAlbum.imgurl = thisAlbum.imgurl || `/imagesw/thmcache/${encodeURIComponent(md5(track.file.substring(0, track.file.lastIndexOf('/'))))}'.jpg`;

      return {
        ...state,
        albums: Object.assign({}, state.albums),
      };
    })).done((tracks) => {
      this.setState({
        ...this.state,
        isLoading: false,
      });
    });
  }

  render() {
    const albumThumbs = Object.values(this.state.albums).map((album) => {
      const albumKey = `${album.album}@${album.artist}`;
      return (<AlbumThumb album={album} key={albumKey} />);
    });

    return (
      <div>
        {albumThumbs}
      </div>
    );
  }

  generateImgUrl() { 

    return 
  }
}

ReactDOM.render(<AlbumView />, document.getElementById('root'));
