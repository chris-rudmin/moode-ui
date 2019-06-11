import md5 from 'md5';
import { MoodeDomain } from '../config/AppConstants';

class Library {
  static addAlbumKey(track) {
    const modifiedTrack = track;
    modifiedTrack.key = `${modifiedTrack.album}@${modifiedTrack.album_artist ||
      modifiedTrack.artist}`.toLowerCase();
    return modifiedTrack;
  }

  static groupByAlbum(acc, track) {
    (acc[track.key] = acc[track.key] || []).push(track);
    return acc;
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
    return Object.values(
      data.map(Library.addAlbumKey).reduce(Library.groupByAlbum, {})
    )
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
          album_key: Library.getAlbumProp(albumTracks, 'key'),
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
