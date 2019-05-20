import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Measure from 'react-measure';
import AlbumCard from './AlbumCard';
import MoodeCommand from '../services/MoodeCommand';
import Library from '../services/Library';
import { cardMaxWidth, cardMargin } from '../config/AppConstants';
import Loading from './Loading';

const totalMargin = cardMargin * 2;
const styles = () => ({
  root: {
    padding: 40
  },
  cardCluster: {
    '&[data-num-cols="2"] > div': {
      width: `calc((100%/2) - ${totalMargin}px)`
    },
    '&[data-num-cols="3"] > div': {
      width: `calc((100%/3) - ${totalMargin}px)`
    },
    '&[data-num-cols="4"] > div': {
      width: `calc((100%/4) - ${totalMargin}px)`
    },
    '&[data-num-cols="5"] > div': {
      width: `calc((100%/5) - ${totalMargin}px)`
    },
    '&[data-num-cols="6"] > div': {
      width: `calc((100%/6) - ${totalMargin}px)`
    },
    '&[data-num-cols="7"] > div': {
      width: `calc((100%/7) - ${totalMargin}px)`
    },
    '&[data-num-cols="8"] > div': {
      width: `calc((100%/8) - ${totalMargin}px)`
    },
    '&[data-num-cols="9"] > div': {
      width: `calc((100%/9) - ${totalMargin}px)`
    },
    '&[data-num-cols="10"] > div': {
      width: `calc((100%/10) - ${totalMargin}px)`
    },
    '&[data-num-cols="11"] > div': {
      width: `calc((100%/11) - ${totalMargin}px)`
    },
    '&[data-num-cols="12"] > div': {
      width: `calc((100%/12) - ${totalMargin}px)`
    }
  }
});

class AlbumGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      albums: [],
      isLoading: false,
      progress: 0,
      numCols: 2
    };
  }

  componentDidMount() {
    this.setState(prevState => ({
      ...prevState,
      isLoading: true
    }));

    MoodeCommand.loadLib().then(({ data }) => {
      this.setState(prevState => ({
        ...prevState,
        albums: Library.getAllAlbums(data),
        isLoading: false
      }));
    });
  }

  static getNumCols(width) {
    return Math.ceil(width / cardMaxWidth);
  }

  render() {
    const { classes } = this.props;
    const albumCards = this.state.albums.map(album => (
      <AlbumCard key={album.albumKey} album={album} />
    ));

    return this.state.isLoading ? (
      <Loading />
    ) : (
      <div className={classes.root}>
        <Measure
          bounds
          onResize={contentRect => {
            this.setState(prevState => ({
              ...prevState,
              numCols: AlbumGrid.getNumCols(contentRect.bounds.width)
            }));
          }}
        >
          {({ measureRef }) => (
            <div
              ref={measureRef}
              className={classes.cardCluster}
              data-num-cols={this.state.numCols}
            >
              {albumCards}
            </div>
          )}
        </Measure>
      </div>
    );
  }
}

AlbumGrid.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(AlbumGrid);
