import axios from 'axios';
import { MoodeDomain } from '../config/AppConstants';

const getPlayStateUrl = `${MoodeDomain}/engine-mpd.php`;

class MpdEngine {
  getPlayState(stateChangeHandler) {
    axios
      .get(getPlayStateUrl, {
        timeout: 600000,
        params: {
          state: this.state,
        },
      })
      .then(({ data }) => {
        this.state = data.state;
        stateChangeHandler(data);
      })
      .finally(() => this.getPlayState(stateChangeHandler));
  }
}

export default MpdEngine;
