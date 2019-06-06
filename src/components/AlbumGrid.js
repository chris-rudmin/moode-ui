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
  gridPadding: {
    padding: `${gridPadding}px 0`,
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
        virtualCards: React.createRef(),
      },
      virtual: {
        colCount: 0,
        rowHeight: 0,
        topRows: 0,
        virtualRows: 0,
        observer: new IntersectionObserver(() => {}),
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
    const [entry] = entries;
    const { virtual } = this.state;
    const heightDiff = entry.rootBounds.top - entry.boundingClientRect.top;
    const rowDiff = heightDiff / virtual.rowHeight;
    const roundedRowDiff = rowDiff > 0 ? Math.ceil(rowDiff) : Math.floor(rowDiff); 
    const topRows = virtual.topRows + roundedRowDiff;
    const boundedTopRows = Math.min(Math.max(0, topRows), virtual.virtualRows);

    if (boundedTopRows !== virtual.topRows) {
      this.setState(state => ({
        ...state,
        virtual: {
          ...virtual,
          topRows: boundedTopRows,
        }
      }));
    }
  }

  onResize({ width, height }) {
    this.setState(state => {
      const colCount = Math.ceil(width / cardMaxWidth);
      const totalRows = Math.ceil(state.allAlbumCards.length / colCount);
      const rowHeight = (width / colCount) + 75; // Card width + footer height
      const actualRows = Math.ceil(height * 4 / rowHeight);
      const actualHeight = actualRows * rowHeight;
      const rootMargin = (actualHeight - height) / 2;
      const cardCount = actualRows * colCount;
      const virtualRows = totalRows - actualRows;
      const { viewPort, virtualCards } = state.refs;
      const observer = new IntersectionObserver(entries => this.onIntersection(entries), {
        root: viewPort.current,
        rootMargin: `${rootMargin}px 0px`,
        threshold: [0, 0.1, 0.2, 0.4, 0.6, 0.8],
      });

      state.virtual.observer.disconnect();
      observer.observe(virtualCards.current);

      return {
        ...state,
        virtual: {
          ...state.virtual,
          colCount,
          rowHeight,
          cardCount,
          virtualRows,
          observer,
        },
      };
    });
  }

  render() {
    const { classes } = this.props;
    const { refs, virtual, allAlbumCards, isLoading } = this.state;
    const cardOffset = virtual.topRows * virtual.colCount;
    const topHeight = virtual.topRows * virtual.rowHeight;
    const bottomHeight = (virtual.virtualRows - virtual.topRows) * virtual.rowHeight;

    return isLoading ? ( <Loading /> ) : (
      <div ref={refs.viewPort} className={classes.viewPort}>
        <Measure bounds onResize={({ bounds }) => this.onResize(bounds)} >
          {({ measureRef }) => (
            <div ref={measureRef} className={classes.measureRef}>
              <div className={classes.gridPadding}>
                <div style={{height: topHeight}} />
                <div ref={refs.virtualCards} className={classes.cardCluster} data-col-count={virtual.colCount} >
                  {allAlbumCards.slice(cardOffset, cardOffset + virtual.cardCount)}
                </div>
                <div style={{height: bottomHeight}} />
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
