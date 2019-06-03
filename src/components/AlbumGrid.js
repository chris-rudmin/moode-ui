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
  albumRoot: {
    height: '100%',
    width: '80%',
    overflowY: 'scroll',
  },
  measureRef: {
    height: '100%',
    padding: '0 40px',
  },
  rootRef: {
    height: '100%',
  },
  gridPadding: {
    padding: '40px 0',
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
      allAlbums: [],
      virtualAlbums: [],
      isLoading: true,
      colCount: 0,
      topCount: 0,
      topHeight: 0,
      virtualHeight: 0,
      totalHeight: 0,
      rowHeight: 0,
      observer: new IntersectionObserver(() => {}),
      rootRef: React.createRef(),
      topRef: React.createRef(),
      bottomRef: React.createRef(),
      virtualRef: React.createRef()
    };
  }

  componentDidMount() {
    MoodeCommand.loadLib().then(({ data }) => {
      this.setState(state => ({
        ...state,
        allAlbums: Library.getAllAlbums(data),
        isLoading: false
      }));
    });
  }

  onIntersection(entries) {
    const topEntry = entries.find(entry => entry.target === this.state.topRef.current);
    const virtualEntry = entries.find(entry => entry.target === this.state.virtualRef.current);
    const bottomEntry = entries.find(entry => entry.target === this.state.bottomRef.current);

    console.log("top", topEntry);
    console.log('virt', virtualEntry);
    console.log('bottom', bottomEntry);


    // entries.forEach(entry => {
    //   const isTopEntry = entry.target === this.state.topRef.current;
    //   const isVirtualEntry = entry.target === this.state.virtualRef.current;
    //   console.log(isTopEntry, isVirtualEntry, entry);
    //   const { intersectionRatio, target } = entry;
    //   const instersectionHeight = Math.floor(target.clientHeight * intersectionRatio);
    //   if (instersectionHeight > this.state.rowHeight) {
    //     const isTopEntry = entry.target === this.state.topRef.current;
    //     const numRows = Math.floor(instersectionHeight / this.state.rowHeight);
    //     const signedNumRows = isTopEntry ? -numRows : numRows;
    //     const numCards = signedNumRows * this.state.colCount;
    //     const heightChange = signedNumRows * this.state.rowHeight;

    //     this.setState(state => ({
    //       ...state,
    //       topCount: state.topCount + numCards,
    //       topHeight: state.topHeight + heightChange,
    //     }));
    //    }
    // });
  }

  onResize({ width, height }) {
    const colCount = Math.ceil((width - 80) / cardMaxWidth);
    const rowCount = Math.ceil(this.state.allAlbums.length / colCount);
    const rowHeight = (width / colCount) + 75; // Card width + footer height
    const totalHeight = rowHeight * rowCount;
    const cardCount = Math.ceil(height / rowHeight) * colCount * 5;
    const virtualHeight = (cardCount / colCount) * rowHeight;
    const rootMargin = (virtualHeight - height) / 2;

    this.state.observer.unobserve(this.state.topRef.current);
    this.state.observer.unobserve(this.state.virtualRef.current);
    this.state.observer.unobserve(this.state.bottomRef.current);

    const observer = new IntersectionObserver(entries => this.onIntersection(entries), {
      root: this.state.rootRef.current,
      rootMargin: `${rootMargin}px 0px`,
      threshold: 0.8
    });

    observer.observe(this.state.topRef.current);
    observer.observe(this.state.virtualRef.current);
    observer.observe(this.state.bottomRef.current);

    this.setState(state => ({
      ...state,
      colCount,
      rowHeight,
      cardCount,
      observer,
      virtualHeight,
      totalHeight,
    }));
  }

  render() {
    const { classes } = this.props;
    const bottomHeight = this.state.totalHeight - this.state.virtualHeight - this.state.topHeight;
    const albumCards = this.state.allAlbums
      .slice(this.state.topCount, this.state.topCount + this.state.cardCount)
      .map(album => (
        <AlbumCard key={album.albumKey} album={album}/>
      ));

    return this.state.isLoading ? ( <Loading /> ) : (
      <div className={classes.albumRoot}>
        <Measure bounds
          onResize={({ bounds }) => this.onResize(bounds)}
        >
          {({ measureRef }) => (
            <div ref={measureRef} className={classes.measureRef}>
              <div ref={this.state.rootRef} className={classes.rootRef}>
                <div className={classes.gridPadding}>
                  <div style={{height: this.state.topHeight}} ref={this.state.topRef}/>
                  <div
                    className={classes.cardCluster}
                    data-col-count={this.state.colCount}
                    ref={this.state.virtualRef}
                  >
                    {albumCards}
                  </div>
                  <div ref={this.state.bottomRef} style={{height: bottomHeight}}/>
                </div>
              </div>
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
