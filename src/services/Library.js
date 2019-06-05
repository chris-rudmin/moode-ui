import md5 from 'md5';
import { MoodeDomain } from '../config/AppConstants';

class Library {
  static groupByArtist(acc, track) {
    const artist = (track.album_artist || track.artist).toLowerCase();
    (acc[artist] = acc[artist] || []).push(track);
    return acc;
  }

  static groupByAlbum(acc, track) {
    const album = track.album.toLowerCase();
    (acc[album] = acc[album] || []).push(track);
    return acc;
  }

  static groupByArtistAlbum(acc, artistTracks) {
    const artistAlbums = artistTracks.reduce(Library.groupByAlbum, {});
    return acc.concat(Object.values(artistAlbums));
  }

  static getAlbumProp(albumTracks, prop) {
    const foundAlbum = albumTracks.find(track => track[prop]);
    return foundAlbum && foundAlbum[prop];
  }

  static getLastModified(albumTracks) {
    const allLastModified = albumTracks.map(
      track => new Date(track.last_modified)
    );
    return new Date(Math.max.apply(null, allLastModified));
  }

  static getAllAlbums(data) {
    return Object.values(data.reduce(Library.groupByArtist, {}))
      .reduce(Library.groupByArtistAlbum, [])
      .map(albumTracks => {
        const title = Library.getAlbumProp(albumTracks, 'album');
        const albumArtist = Library.getAlbumProp(albumTracks, 'album_artist');
        const artist = Library.getAlbumProp(albumTracks, 'artist');
        const { file } = albumTracks.find(track => track.file);
        const hash = encodeURIComponent(
          md5(file.substring(0, file.lastIndexOf('/')))
        );

        return {
          title,
          album_key: `${title}@${artist}@${hash}`.toLowerCase(),
          tracks: albumTracks.map(track => track.file),
          artist: albumArtist || artist,
          last_modified: Library.getLastModified(albumTracks),
          thumb_url: `${MoodeDomain}/imagesw/thmcache/${hash}.jpg`
        };
      })
      .sort((a, b) => b.last_modified - a.last_modified);
  }
}

export default Library;
