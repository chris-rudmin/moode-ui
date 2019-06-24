import React from 'react';
import PropTypes from 'prop-types';
import { cardMargin, AlbumShape, MoodeDomain } from '../config/AppConstants';
import MoodeCommand from '../services/MoodeCommand';

const defaultAlbum = `${MoodeDomain}/images/default-cover-v6.svg`;
export const cardStyles = `
  .albumCard {
    display: inline-block;
    margin: ${cardMargin}px;
    overflow: hidden;
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12);
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

const AlbumCard = ({ album }) => {
  return (
    <div
      onClick={() => MoodeCommand.clearPlayAll(album.tracks)}
      className="albumCard"
    >
      <div
        style={{
          backgroundImage: `url(${album.thumb_url}),url(${defaultAlbum})`,
        }}
        title={album.title}
        className="albumThumb"
      />
      <div className="cardContent">
        <p className="albumTitle">{album.title}</p>
        <p className="albumArtist">{album.artist}</p>
      </div>
    </div>
  );
};

AlbumCard.propTypes = {
  album: AlbumShape.isRequired,
};

export default AlbumCard;
