import React, { Component, useRef } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Measure from 'react-measure';
import AlbumCard from './AlbumCard';
import MoodeCommand from '../services/MoodeCommand';
import Library from '../services/Library';
import { cardMaxWidth, cardMargin } from '../config/AppConstants';
import Loading from './Loading';
import { useInView } from 'react-intersection-observer'

const totalMargin = cardMargin * 2;
const styles = () => ({
  root: {
    padding: 40
  },
  cardCluster: {
    '&[data-col-count="2"] > div': {
      width: `calc((100%/2) - ${totalMargin}px)`
    },
    '&[data-col-count="3"] > div': {
      width: `calc((100%/3) - ${totalMargin}px)`
    },
    '&[data-col-count="4"] > div': {
      width: `calc((100%/4) - ${totalMargin}px)`
    },
    '&[data-col-count="5"] > div': {
      width: `calc((100%/5) - ${totalMargin}px)`
    },
    '&[data-col-count="6"] > div': {
      width: `calc((100%/6) - ${totalMargin}px)`
    },
    '&[data-col-count="7"] > div': {
      width: `calc((100%/7) - ${totalMargin}px)`
    },
    '&[data-col-count="8"] > div': {
      width: `calc((100%/8) - ${totalMargin}px)`
    },
    '&[data-col-count="9"] > div': {
      width: `calc((100%/9) - ${totalMargin}px)`
    },
    '&[data-col-count="10"] > div': {
      width: `calc((100%/10) - ${totalMargin}px)`
    },
    '&[data-col-count="11"] > div': {
      width: `calc((100%/11) - ${totalMargin}px)`
    },
    '&[data-col-count="12"] > div': {
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
      colCount: 0,
      rowCount: 0,
      rowHeight: 0,
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

  render() {
    const { classes } = this.props;
    const albumCards = this.state.albums.map(album => (
      <AlbumCard key={album.albumKey} album={album}/>
    ));

    return this.state.isLoading ? (
      <Loading />
    ) : (
      <Measure
        bounds
        onResize={({ bounds }) => {
          const colCount = Math.ceil(bounds.width / cardMaxWidth);
          const rowCount = Math.ceil(this.state.albums.length / colCount);
          const rowHeight = (bounds.width / colCount) + 68;
          const viewportHeight = rowHeight * 8;
          const totalHeight = rowHeight * rowCount;
          this.setState(prevState => ({
            ...prevState,
            colCount,
            rowCount,
            rowHeight,
          }));
        }}
      >
        {({ measureRef }) => (
          <div className={classes.root}>
            <div/>
            <div
              ref={measureRef}
              className={classes.cardCluster}
              data-col-count={this.state.colCount}
            >
              {albumCards.slice(0,this.state.colCount*10)}
            </div>
            <div style={{height: this.state.rowHeight*this.state.rowCount}} />
          </div>
        )}
      </Measure>
    );
  }
}

AlbumGrid.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(AlbumGrid);
