import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import MpdEngine from '../services/MpdEngine';
import { MoodeDomain } from '../config/AppConstants';

const styles = theme => ({
  player: {
    height: 91,
    flexShrink: 0,
  },
  drawerPaper: {
    height: 91,
    borderTop: `1px solid ${theme.palette.primary.dark}`,
    flexDirection: 'row',
  },
  image: {
    width: 90,
    height: 90,
    objectFit: 'cover',
  },
  artistInfo: {
    display: 'flex',
    marginLeft: 10,
    alignItems: 'center',
  },
});

class Player extends PureComponent {
  constructor(props) {
    super(props);
    this.mpdEngine = new MpdEngine();
    this.state = {
      playState: {
        artist: '',
        album: '',
        coverurl: '',
      },
    };
  }

  componentDidMount() {
    this.mpdEngine.getPlayState(playState => {
      this.setState(state => ({
        ...state,
        playState,
      }));
    });
  }

  render() {
    const { classes } = this.props;
    const { playState } = this.state;
    // API returns paths with and without beginning slashes
    const coverUrl = playState.coverurl.startsWith('/')
      ? playState.coverurl
      : `/${playState.coverurl}`;

    return (
      <Drawer
        className={classes.player}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="bottom"
      >
        <img
          className={classes.image}
          src={`${MoodeDomain}${coverUrl}`}
          alt={playState.album}
        />

        <div className={classes.artistInfo}>
          <div>
            <Typography variant="body1" noWrap>
              {playState.title}
            </Typography>
            <Typography variant="caption" noWrap>
              {`${playState.artist} - ${playState.album}`}
            </Typography>
          </div>
        </div>
      </Drawer>
    );
  }
}

Player.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(Player);
