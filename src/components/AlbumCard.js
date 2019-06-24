import React from 'react';
import PropTypes from 'prop-types';
import { AlbumShape, MoodeDomain } from '../config/AppConstants';
import MoodeCommand from '../services/MoodeCommand';

const defaultAlbum = `${MoodeDomain}/images/default-cover-v6.svg`;
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
