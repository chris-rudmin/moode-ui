import axios from 'axios';
import { MoodeDomain } from '../config/AppConstants';

const url = cmd => `${MoodeDomain}/command/moode.php?cmd=${cmd}`;

class MoodeCommand {
  static clearPlayAll(tracks) {
    const formData = new FormData();
    tracks.forEach(file => formData.append('path[]', file));
    return axios.post(url('clrplayall'), formData);
  }

  static loadLib() {
    return axios.post(url('loadlib'));
  }
}

export default MoodeCommand;
