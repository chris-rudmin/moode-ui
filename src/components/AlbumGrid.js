import React, { Component } from 'react';
import PropTypes from 'prop-types';
import oboe from 'oboe';
import md5 from 'md5';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { FixedSizeGrid as AlbumGridWindow } from 'react-window';
import { MoodeDomain } from '../config/AppConstants';
import AlbumCard from './AlbumCard';


const styles = () => ({
  root: {
    flexGrow: 1,
  },
  card: {
  }
});


class AlbumGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      albums: {},
      isLoading: false,
    };
  }

  componentDidMount() {
    oboe({
      url: `${MoodeDomain}/command/moode.php?cmd=loadlib`,
      method: 'POST',
    }).node('!.*', track => this.setState((state) => {
      const newAlbums = { ...state.albums };
      const artist = track.album_artist || track.artist;
      const albumKey = `${track.album}@${artist}`;
      const hash = encodeURIComponent(md5(track.file.substring(0, track.file.lastIndexOf('/'))));

      newAlbums[albumKey] = newAlbums[albumKey] || {
        albumKey,
        title: track.album,
        artist,
        tracks: [],
        thumb_url: `${MoodeDomain}/imagesw/thmcache/${hash}.jpg`,
      };

      const thisAlbum = newAlbums[albumKey];
      track.last_modified = new Date(track.last_modified);
      thisAlbum.tracks.push(track);
      thisAlbum.genre = thisAlbum.genre || track.genre;
      thisAlbum.year = thisAlbum.year || track.year;

      const lastModified = Math.max.apply(null, thisAlbum.tracks.map(albumTrack => albumTrack.last_modified));
      thisAlbum.last_modified = new Date(lastModified);

      return {
        ...state,
        albums: newAlbums,
        isLoading: true,
      };
    })).done((tracks) => {
      this.setState({
        ...this.state,
        isLoading: false,
      });
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !nextState.isLoading
      || Object.keys(nextState.albums).length !== Object.keys(this.state.albums).length && Object.keys(nextState.albums).length < 200;

  }

  render() {
    const { classes } = this.props;
    const albumCards = Object.values(this.state.albums)
      .sort((a, b) => b.last_modified - a.last_modified)
      .map(album => (
        <Grid key={album.albumKey} item xs>
          <AlbumCard className={classes.card} album={album} />
        </Grid>
      ));

    return (
      <div className={classes.root}>
        <Grid
          container
          className={classes.root}
          spacing={8}
          direction="row"
          justify="space-around"
          alignItems="flex-start"
        >
          {albumCards}
        </Grid>
      </div>
    );
  }
}

AlbumGrid.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};


export default withStyles(styles)(AlbumGrid);
