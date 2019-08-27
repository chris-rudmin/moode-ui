import axios from 'axios';
import { MoodeDomain } from '../config/AppConstants';

const url = `${MoodeDomain}/command/moode.php`;

class MoodeCommand {
  static clearPlayAll(tracks) {
    const formData = new FormData();
    tracks.forEach(file => formData.append('path[]', file));
    return axios.post(url, formData, {
      params: {
        cmd: 'clrplayall',
      },
    });
  }

  static loadLib() {
    return axios.post(url, null, {
      params: {
        cmd: 'loadlib',
      },
    });
  }
}

export default MoodeCommand;
