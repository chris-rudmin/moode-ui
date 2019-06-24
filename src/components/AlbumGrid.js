import React, { Component } from 'react';
import styled from 'styled-components';
import Measure from 'react-measure';
import AlbumCard from './AlbumCard';
import MoodeCommand from '../services/MoodeCommand';
import Library from '../services/Library';
import { cardMaxWidth, cardMargin } from '../config/AppConstants';
import Loading from './Loading';

const totalMargin = cardMargin * 2;
const cardWidth = Array(12)
  .fill(0)
  .map(
    (val, i) => `
  &[data-col-count="${i + 2}"] .albumCard {
    width: calc((100%/${i + 2}) - ${totalMargin}px);
  }
`
  )
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

  .albumCard {
    display: inline-block;
    margin: ${cardMargin}px;
    overflow: hidden;
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2),
      0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    color: #fff;
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    background-color: #424242;
  }

  .albumThumb {
    width: 100%;
    padding-bottom: 100%;
    background-image: ;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }

  .cardContent {
    padding: 16px;
  }

  .cardContent > p {
    margin: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
    font-weight: 400;
  }

  .albumTitle {
    font-size: 1rem;
    line-height: 1.5;
    letter-spacing: 0.00938em;
  }

  .albumArtist {
    font-size: 0.75rem;
    line-height: 1.66;
    letter-spacing: 0.03333em;
  }
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
