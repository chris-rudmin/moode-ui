import React, { Component } from 'react';
import styled from 'styled-components';
import Measure from 'react-measure';
import AlbumCard, { cardStyles } from './AlbumCard';
import MoodeCommand from '../services/MoodeCommand';
import Library from '../services/Library';
import { cardMaxWidth, cardMargin } from '../config/AppConstants';
import Loading from './Loading';

const totalMargin = cardMargin * 2;
const cardWidth = Array(12)
  .fill(0)
  .map((val, i) => `
    &[data-col-count="${i + 2}"] .albumCard {
      width: calc((100%/${i + 2}) - ${totalMargin}px);
    }
  `)
  .join('');

const ViewPort = styled.div`
  flex: 1;
  overflow-y: scroll;
  padding: 0 40px;
`;

const MeasureRef = styled.div`
  height: 100%;
`;

const GridPadding = styled.div`
  padding: 20px 0;
`;

const CardCluster = styled.div`
  ${cardWidth}
  ${cardStyles}
`;

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
    const topHeight = topRows * rowHeight;
    const scrollHeight = event.target.scrollTop - rootMargin;
    const scrollDiff = scrollHeight - topHeight;
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

    const cardOffset = topRows * colCount;
    const topHeight = topRows * rowHeight;
    const bottomHeight = (virtualRows - topRows) * rowHeight;
    const virtualCards = allAlbumCards.slice(
      cardOffset,
      cardOffset + cardCount
    );

    return isLoading ? (
      <Loading />
    ) : (
      <ViewPort onScroll={event => this.onScroll(event)}>
        <Measure bounds onResize={({ bounds }) => this.onResize(bounds)}>
          {({ measureRef }) => (
            <MeasureRef ref={measureRef}>
              <GridPadding>
                <div style={{ height: topHeight }} />
                <CardCluster data-col-count={colCount}>
                  {virtualCards}
                </CardCluster>
                <div style={{ height: bottomHeight }} />
              </GridPadding>
            </MeasureRef>
          )}
        </Measure>
      </ViewPort>
    );
  }
}

export default AlbumGrid;
