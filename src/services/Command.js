import axios from 'axios';
import { MoodeDomain } from '../config/AppConstants';

const commandUrl = `${MoodeDomain}/command/`;

class Command {
  static next() {
    return axios.get(commandUrl, {
      params: {
        cmd: 'next',
      },
    });
  }

  static pause() {
    return axios.get(commandUrl, {
      params: {
        cmd: 'pause',
      },
    });
  }

  static play(trackIndex = 0) {
    return axios.get(commandUrl, {
      params: {
        cmd: `play ${trackIndex}`,
      },
    });
  }

  static resume() {
    return axios.get(commandUrl, {
      params: {
        cmd: 'play',
      },
    });
  }

  static seek(trackIndex = 0, seekTime = 0) {
    return axios.get(commandUrl, {
      params: {
        cmd: `seek ${trackIndex} ${seekTime}`,
      },
    });
  }
}

export default Command;
