import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import MpdEngine from '../services/MpdEngine';
import Command from '../services/Command';
import { MoodeDomain } from '../config/AppConstants';
import { PlayArrow, Pause, SkipNext, SkipPrevious } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';

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
    flex: 1,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
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
        <div className={classes.controls}>
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
        </div>

        <div className={classes.controls}>
          <IconButton
            aria-label="Skip Previous"
            aria-controls="Skip Previous"
            aria-haspopup="true"
            onClick={() => {}}
            color="inherit"
          >
            <SkipPrevious fontSize="small" />
          </IconButton>

          <IconButton
            aria-label="Play"
            aria-controls="Play"
            aria-haspopup="true"
            onClick={() => Command.play()}
            color="inherit"
          >
            <PlayArrow fontSize="large" />
          </IconButton>

          <IconButton
            aria-label="Skip Next"
            aria-controls="Skip Next"
            aria-haspopup="true"
            onClick={() => {}}
            color="inherit"
          >
            <SkipNext fontSize="small" />
          </IconButton>
        </div>

        <div className={classes.controls}>
          Test
        </div>

      </Drawer>
    );
  }
}

Player.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(Player);
