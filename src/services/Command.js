import axios from 'axios';
import { MoodeDomain } from '../config/AppConstants';

const commandUrl = `${MoodeDomain}/command/`;

class Command {
  static play() {
    return axios.get(commandUrl, {
      params: {
        cmd: 'play',
      },
    });
  }
}

export default Command;
