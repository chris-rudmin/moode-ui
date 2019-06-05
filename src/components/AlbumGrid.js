import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Measure from 'react-measure';
import AlbumCard from './AlbumCard';
import MoodeCommand from '../services/MoodeCommand';
import Library from '../services/Library';
import { cardMaxWidth, cardMargin, gridPadding } from '../config/AppConstants';
import Loading from './Loading';


const totalMargin = cardMargin * 2;
const styles = () => ({
  viewPort: {
    height: '100%',
    overflowY: 'scroll',
    padding: `0 ${gridPadding}px`,
  },
  measureRef: {
    height: '100%',
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
      allAlbumCards: [(<div/>)],
      isLoading: true,
      refs: {
        viewPort: React.createRef(),
        virtualTop: React.createRef(),
        virtualBottom: React.createRef(),
      },
      virtual: {
        bottomHeight: 0,
        colCount: 0,
        observer: new IntersectionObserver(() => {}),
        rowHeight: 0,
        topCount: 0,
        topHeight: 0,
        virtualHeight: 0,
      }
    };
  }

  componentDidMount() {
    MoodeCommand.loadLib().then(({ data }) => {
      this.setState(state => ({
        ...state,
        allAlbumCards: Library.getAllAlbums(data).map(album => (
          <AlbumCard key={album.album_key} album={album}/>
        )),
        isLoading: false
      }));
    });
  }

  onIntersection(entries) {
    const { virtualTop, virtualBottom } = this.state.refs;
    const topEntry = entries.find(entry => entry.target === virtualTop.current);
    const bottomEntry = entries.find(entry => entry.target === virtualBottom.current);

    // scrolling up
    if (topEntry && topEntry.isIntersecting) {
      this.setState(state => {
        const { virtual } = state;
        const heightDiff = topEntry.boundingClientRect.bottom - topEntry.rootBounds.top;
        const rowDiff = Math.ceil(heightDiff / virtual.rowHeight);
        const topHeight = Math.max(0, virtual.topHeight - (rowDiff * virtual.rowHeight));
        return {
          ...state,
          virtual: {
            ...virtual,
            topCount: Math.max(0, virtual.topCount - (rowDiff * virtual.colCount)),
            topHeight,
            bottomHeight: virtual.virtualHeight - topHeight,
          }
        };
      });
    }

    // scrolling down
    else if (bottomEntry && bottomEntry.isIntersecting) {
      this.setState(state => {
        const { virtual } = state;
        const heightDiff = bottomEntry.rootBounds.bottom - bottomEntry.boundingClientRect.top;
        const rowDiff = Math.ceil(heightDiff / virtual.rowHeight);
        const bottomHeight = Math.max(0, virtual.bottomHeight - (rowDiff * virtual.rowHeight));
        return {
          ...state,
          virtual: {
            ...virtual,
            topCount: virtual.topCount + (rowDiff * virtual.colCount),
            topHeight: virtual.virtualHeight - bottomHeight,
            bottomHeight,   
          }
        };
      });
    }
  }

  onResize({ width, height }) {
    const colCount = Math.ceil(width / cardMaxWidth);
    const totalRows = Math.ceil(this.state.allAlbumCards.length / colCount);
    const rowHeight = (width / colCount) + 75; // Card width + footer height
    const totalHeight = rowHeight * totalRows;
    const actualRows = Math.ceil(height * 4 / rowHeight);
    const actualHeight = actualRows * rowHeight;
    const rootMargin = (actualHeight - (rowHeight * 2) - height) / 2;
    const cardCount = actualRows * colCount;
    const virtualHeight = totalHeight - actualHeight;
    const { viewPort, virtualTop, virtualBottom } = this.state.refs;

    this.state.virtual.observer.unobserve(virtualTop.current);
    this.state.virtual.observer.unobserve(virtualBottom.current);

    const observer = new IntersectionObserver(entries => this.onIntersection(entries), {
      root: viewPort.current,
      rootMargin: `${rootMargin}px 0px`,
      threshold: [0, 0.0001, 0.0003, 0.0006, 0.001, 0.003, 0.006, 0.01, 0.03, 0.06, 0.1, 0.3, 0.6],
    });

    observer.observe(virtualTop.current);
    observer.observe(virtualBottom.current);

    this.setState(state => ({
      ...state,
      virtual: {
        ...state.virtual,
        colCount,
        rowHeight,
        cardCount,
        observer,
        virtualHeight,
      }
    }));
  }

  render() {
    const { classes } = this.props;
    const { refs, virtual } = this.state;

    return this.state.isLoading ? ( <Loading /> ) : (
      <div ref={refs.viewPort} className={classes.viewPort}>
        <Measure bounds onResize={({ bounds }) => this.onResize(bounds)} >
          {({ measureRef }) => (
            <div ref={measureRef} className={classes.measureRef}>
              <div ref={refs.virtualTop} style={{height: virtual.topHeight, paddingTop: gridPadding}} />
              <div className={classes.cardCluster} data-col-count={virtual.colCount} >
                {this.state.allAlbumCards.slice(virtual.topCount, virtual.topCount + virtual.cardCount)}
              </div>
              <div ref={refs.virtualBottom} style={{height: virtual.bottomHeight, paddingBottom: gridPadding}} />
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
