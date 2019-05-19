import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import AlbumCard from './AlbumCard';
import MoodeCommand from '../services/MoodeCommand';
import Library from '../services/Library';

const styles = () => ({
  root: {
    padding: 40,
    paddingRight: 100
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  gridItem: {
    minWidth: 180,
    maxWidth: 240,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0
  }
});

class AlbumGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      albums: [],
      isLoading: false,
      progress: 0
    };
  }

  componentDidMount() {
    this.setState(prevState => ({
      ...prevState,
      isLoading: true
    }));

    MoodeCommand.loadLib().then(({ data }) => {
      const allAlbums = Library.getAllAlbums(data);

      this.setState(prevState => ({
        ...prevState,
        albums: allAlbums,
        isLoading: false
      }));
    });
  }

  render() {
    const { classes } = this.props;
    const albumCards = this.state.albums.map(album => (
      <Grid key={album.albumKey} className={classes.gridItem} item>
        <AlbumCard album={album} />
      </Grid>
    ));

    return this.state.isLoading ? (
      <div className={classes.loading}>
        <Typography variant="h5" gutterBottom>
          Loading Library
        </Typography>
        <CircularProgress variant="indeterminate" size={80} />
      </div>
    ) : (
      <div className={classes.root}>
        <Grid container spacing={16} direction="row" alignItems="flex-start">
          {albumCards}
        </Grid>
      </div>
    );
  }
}

AlbumGrid.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(AlbumGrid);
