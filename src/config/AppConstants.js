import PropTypes from 'prop-types';

export const TrackShape = PropTypes.shape({
  album: PropTypes.string,
  album_artist: PropTypes.string,
  artist: PropTypes.string,
  artist: PropTypes.string,
  composer: PropTypes.string,
  disc: PropTypes.string,
  file: PropTypes.string,
  genre: PropTypes.string,
  last_modified: PropTypes.string,
  time: PropTypes.string,
  time_mmss: PropTypes.string,
  title: PropTypes.string,
  tracknum: PropTypes.string,
  year: PropTypes.string,
});

export const AlbumShape = PropTypes.shape({
  title: PropTypes.string.isRequired,
  artist: PropTypes.string,
  composer: PropTypes.string,
  disc: PropTypes.string,
  genre: PropTypes.string,
  last_modified: PropTypes.string,
  year: PropTypes.string,
  imgurl: PropTypes.string,
  tracks: PropTypes.arrayOf(TrackShape)
});
