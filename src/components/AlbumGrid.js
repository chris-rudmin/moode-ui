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
  viewPort: {
    flex: 1,
    overflowY: 'scroll',
    padding: '0 40px',
  },
  measureRef: {
    height: '100%',
  },
  gridPadding: {
    padding: '20px 0',
  },
  cardCluster: Array(12)
    .fill(0)
    .reduce((acc, val, i) => {
      acc[`&[data-col-count="${i + 2}"] > div`] = {
        width: `calc((100%/${i + 2}) - ${totalMargin}px)`,
      };
      return acc;
    }, {}),
});

class AlbumGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allAlbumCards: [<div />],
      isLoading: true,
      colCount: 0,
      rowHeight: 0,
      topRows: 0,
      virtualRows: 0,
      cardCount: 0,
      rootMargin: 0,
    };
  }

  componentDidMount() {
    MoodeCommand.loadLib().then(({ data }) => {
      this.setState(state => ({
        ...state,
        allAlbumCards: Library.getAllAlbums(data).map(album => (
          <AlbumCard key={album.album_key} album={album} />
        )),
        isLoading: false,
      }));
    });
  }

  onScroll(event) {
    const { topRows, rootMargin, rowHeight, virtualRows } = this.state;
    const scrollHeight = event.target.scrollTop - rootMargin;
    const scrollDiff = scrollHeight - topRows * rowHeight;
    const newTopRows = Math.trunc(scrollDiff / rowHeight) + topRows;
    const boundedTopRows = Math.min(Math.max(0, newTopRows), virtualRows);

    if (boundedTopRows !== topRows) {
      this.setState(state => ({
        ...state,
        topRows: boundedTopRows,
      }));
    }
  }

  onResize({ width, height }) {
    this.setState(state => {
      const colCount = Math.ceil(width / cardMaxWidth);
      const totalRows = Math.ceil(state.allAlbumCards.length / colCount);
      const rowHeight = width / colCount + 80; // Card media height + card footer height + card border height
      const actualRows = 7;
      const actualHeight = actualRows * rowHeight;
      const rootMargin = (actualHeight - height) / 2;
      const cardCount = actualRows * colCount;
      const virtualRows = totalRows - actualRows;

      return {
        ...state,
        colCount,
        rowHeight,
        cardCount,
        virtualRows,
        rootMargin,
      };
    });
  }

  render() {
    const {
      virtualRows,
      topRows,
      colCount,
      rowHeight,
      allAlbumCards,
      isLoading,
      cardCount,
    } = this.state;
    const { classes } = this.props;
    const cardOffset = topRows * colCount;
    const topHeight = topRows * rowHeight;
    const bottomHeight = (virtualRows - topRows) * rowHeight;

    return isLoading ? (
      <Loading />
    ) : (
      <div
        onScroll={event => this.onScroll(event)}
        className={classes.viewPort}
      >
        <Measure bounds onResize={({ bounds }) => this.onResize(bounds)}>
          {({ measureRef }) => (
            <div ref={measureRef} className={classes.measureRef}>
              <div className={classes.gridPadding}>
                <div style={{ height: topHeight }} />
                <div className={classes.cardCluster} data-col-count={colCount}>
                  {allAlbumCards.slice(cardOffset, cardOffset + cardCount)}
                </div>
                <div style={{ height: bottomHeight }} />
              </div>
            </div>
          )}
        </Measure>
      </div>
    );
  }
}

AlbumGrid.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(AlbumGrid);
