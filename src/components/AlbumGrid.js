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
    height: '100%',
    padding: '0 40px',
  },
  measureRef: {
    height: '100%'
  },
  rootRef: {
    padding: '40px 0'
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
      bottomHeight: 0,
      topObserver: new IntersectionObserver(() => {}),
      bottomObserver: new IntersectionObserver(() => {}),
      rootRef: React.createRef(),
      topRef: React.createRef(),
      bottomRef: React.createRef()
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

  onResize({ width, height }) {
    const colCount = Math.ceil(width / cardMaxWidth);
    const rowCount = Math.ceil(this.state.allAlbums.length / colCount);
    const rowHeight = Math.ceil(width / colCount) + 75; // Card width + footer height
    const totalHeight = rowHeight * rowCount;
    const cardCount = Math.ceil(height / rowHeight) * colCount * 5;
    const virtualHeight = Math.ceil(cardCount / colCount) * rowHeight;
    const rootMargin = Math.floor((virtualHeight - height) / 2);
    const observerOptions = {
      rootMargin: `${rootMargin}px 0px`,
      threshold: 0
    };

    this.state.topObserver.unobserve(this.state.topRef.current);
    const topObserver = new IntersectionObserver(entries => {
      console.log("top", entries);
      entries.forEach(entry => {
        const { intersectionRatio, target } = entry;
        const instersectionHeight = Math.floor(target.clientHeight * intersectionRatio);
        if (instersectionHeight > rowHeight) {
          const numRows = Math.floor(instersectionHeight / rowHeight);
          const numCards = numRows * colCount;
          const heightChange = numRows * rowHeight
          this.setState(state => ({
            ...state,
            topCount: state.topCount - numCards,
            topHeight: state.topHeight - heightChange,
            bottomHeight: state.bottomHeight + heightChange
          }));
         }
      });
    }, observerOptions);
    topObserver.observe(this.state.topRef.current);

    this.state.bottomObserver.unobserve(this.state.bottomRef.current);
    const bottomObserver = new IntersectionObserver(entries => {
      console.log("bottom", entries);
      entries.forEach(entry => {
        const { intersectionRatio, target } = entry;
        const instersectionHeight = Math.floor(target.clientHeight * intersectionRatio);
        if (instersectionHeight > rowHeight) {
          const numRows = Math.floor(instersectionHeight / rowHeight);
          const numCards = numRows * colCount;
          const heightChange = numRows * rowHeight
          this.setState(state => ({
            ...state,
            topCount: state.topCount + numCards,
            topHeight: state.topHeight + heightChange,
            bottomHeight: state.bottomHeight - heightChange
          }));
         }
      });
    }, observerOptions);
    bottomObserver.observe(this.state.bottomRef.current);

    this.setState(state => ({
      ...state,
      colCount,
      cardCount,
      topObserver,
      bottomObserver,
      bottomHeight: totalHeight - virtualHeight,
    }));
  }

  render() {
    const { classes } = this.props;
    const albumCards = this.state.allAlbums
      .slice(this.state.topCount, this.state.topCount + this.state.cardCount)
      .map(album => (
        <AlbumCard key={album.albumKey} album={album}/>
      ));

    return this.state.isLoading ? ( <Loading /> ) : (
      <div className={classes.root}>
        <Measure bounds
          onResize={({ bounds }) => this.onResize(bounds)}
        >
          {({ measureRef }) => (
            <div ref={measureRef} className={classes.measureRef}>
              <div className={classes.rootRef}>
                <div style={{height: this.state.topHeight}} ref={this.state.topRef}/>
                <div
                  className={classes.cardCluster}
                  data-col-count={this.state.colCount}
                >
                  {albumCards}
                </div>
                <div style={{height: this.state.bottomHeight}} ref={this.state.bottomRef}/>
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
