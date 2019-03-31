import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import md5 from 'md5';
import { FixedSizeGrid as FixedAlbumGrid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { MoodeDomain } from '../config/AppConstants';
import AlbumCard from './AlbumCard';
import styled from 'styled-components';


const Container = styled.div`
  display: flex;
  flex: 0 0 200px;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
`;

class AlbumGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      albums: {},
      isLoading: false,
    };
  }

  componentDidMount() {
    this.setState({
      ...this.state,
      isLoading: true,
    });

    axios.post(`${MoodeDomain}/command/moode.php?cmd=loadlib`).then(({data}) => {
      console.log(data);

      var groupByArtist = function(acc, track) {
        var artist = track.album_artist || track.artist;
        (acc[artist] = acc[artist] || []).push(track);
        return acc;
      };

      var groupByAlbum = function(acc, track) {
        (acc[track.album] = acc[track.album] || []).push(track);
        return acc;
      };

      var allArtistAlbums = Object.values(data.reduce(groupByArtist, {})).reduce((acc, artistTracks) => {
        var artistAlbums = artistTracks.reduce(groupByAlbum, {});
        return acc.concat(Object.values(artistAlbums));
      }, []);

      const allAlbums = allArtistAlbums.map(function(albumTracks){
        const title = albumTracks.find(track => track.album).album;
        const album_artist = albumTracks.find(track => track.album_artist);
        const artist = (album_artist && album_artist.album_artist) || albumTracks.find(track => track.artist).artist;
        const allLastModified = albumTracks.map(track => new Date(track.last_modified));
        const last_modified = new Date(Math.max.apply(null, allLastModified));

        const file = albumTracks.find(track => track.file).file;
        const hash = encodeURIComponent(md5(file.substring(0, file.lastIndexOf('/'))));

        return {
          album_key: `${title}@${artist}`,
          tracks: albumTracks,
          artist,
          last_modified,
          title,
          thumb_url: `${MoodeDomain}/imagesw/thmcache/${hash}.jpg`,
        };
      }).sort((a, b) => b.last_modified - a.last_modified);

      this.setState({
        ...this.state,
        albums: allAlbums,
        isLoading: false,
      });
    });
  }

  render() {
    const albumLength = this.state.albums.length;
    const items = ({ columnIndex, rowIndex, style}) => {
      const index = columnIndex + (rowIndex * 8);
      const album = this.state.albums[index];
      if (album){
        return <AlbumCard key={album.albumKey} album={album} style={style}/>
      }
      return <div key={index} style={style}></div>//
    };

    return (
        <AutoSizer>
          {({height, width}) => (
            <FixedAlbumGrid 
              columnCount={8}
              columnWidth={208}
              height={height}
              rowCount={Math.ceil(albumLength/8)}
              rowHeight={276}
              width={width}
            >
              {items}
            </FixedAlbumGrid>
          )}
        </AutoSizer>
    );
  }
}

export default AlbumGrid;
