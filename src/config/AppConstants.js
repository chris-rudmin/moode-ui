import PropTypes from 'prop-types';

// export const TrackShape = PropTypes.shape({
//   album: PropTypes.string,
//   album_artist: PropTypes.string,
//   artist: PropTypes.string,
//   composer: PropTypes.string,
//   disc: PropTypes.string,
//   file: PropTypes.string,
//   genre: PropTypes.string,
//   last_modified: PropTypes.string,
//   time: PropTypes.string,
//   time_mmss: PropTypes.string,
//   title: PropTypes.string,
//   tracknum: PropTypes.string,
//   year: PropTypes.string
// });

export const AlbumShape = PropTypes.shape({
  title: PropTypes.string,
  artist: PropTypes.string,
  composer: PropTypes.string,
  genre: PropTypes.string,
  last_modified: PropTypes.instanceOf(Date),
  year: PropTypes.string,
  thumb_url: PropTypes.string,
  tracks: PropTypes.arrayOf(PropTypes.string)
});

export const MoodeDomain = 'http://dev-moode.local';

export const cardMargin = 8;
export const cardMaxWidth = 210 + cardMargin * 2;
