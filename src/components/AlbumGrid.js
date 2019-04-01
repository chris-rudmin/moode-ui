import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import md5 from 'md5';
import { MoodeDomain } from '../config/AppConstants';
import AlbumCard from './AlbumCard';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = () => ({
  root: {
    flexGrow: 1,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 12,
    paddingBottom: 8,
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  progress: {
  }
});

class AlbumGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      albums: [],
      isLoading: false,
      progress: 0,
    };
  }

  componentDidMount() {
    this.setState({
      ...this.state,
      isLoading: true,
    });

    axios.post(`${MoodeDomain}/command/moode.php?cmd=loadlib`).then(({data}) => {

      const groupByArtist = (acc, track) => {
        const artist = track.album_artist || track.artist;
        (acc[artist] = acc[artist] || []).push(track);
        return acc;
      };

      const groupByAlbum = (acc, track) => {
        (acc[track.album] = acc[track.album] || []).push(track);
        return acc;
      };

      const allArtistAlbums = Object.values(data.reduce(groupByArtist, {})).reduce((acc, artistTracks) => {
        var artistAlbums = artistTracks.reduce(groupByAlbum, {});
        return acc.concat(Object.values(artistAlbums));
      }, []);

      const allAlbums = allArtistAlbums.map(function(albumTracks){
        const title = albumTracks.find(track => track.album).album;
        const album_artist = albumTracks.find(track => track.album_artist);
        const artist = (album_artist && album_artist.album_artist) || albumTracks.find(track => track.artist).artist;
        const allLastModified = albumTracks.map(track => new Date(track.last_modified));
        const last_modified = new Date(Math.max.apply(null, allLastModified));
        const file = albumTracks.find(track => track.file).file;
        const hash = encodeURIComponent(md5(file.substring(0, file.lastIndexOf('/'))));

        return {
          album_key: `${title}@${artist}`,
          tracks: albumTracks,
          artist,
          last_modified,
          title,
          thumb_url: `${MoodeDomain}/imagesw/thmcache/${hash}.jpg`,
        };
      }).sort((a, b) => b.last_modified - a.last_modified);

      this.setState({
        ...this.state,
        albums: allAlbums,
        isLoading: false,
      });
    });
  }

  render() {
    const { classes } = this.props;
    const albumCards = this.state.albums.map(album => (
      <Grid key={album.albumKey} item xs>
        <AlbumCard className={classes.card} album={album} />
      </Grid>
    ));

    return this.state.isLoading ? (
        <div className={classes.loading}>
          <Typography variant="h5" gutterBottom={true}>
            Loading Library
          </Typography>
          <CircularProgress
            className={classes.progress}
            variant="indeterminate"
            size={80}
          />
        </div>
      ) : (
        <div id='gridRoot' className={classes.root}>
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
