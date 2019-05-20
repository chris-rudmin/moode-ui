import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import RootRef from '@material-ui/core/RootRef';
import { AlbumShape, MoodeDomain, cardMargin } from '../config/AppConstants';
import MoodeCommand from '../services/MoodeCommand';

const defaultImage = `${MoodeDomain}/images/default-cover-v6.svg`;
const styles = {
  media: {
    width: '100%',
    paddingBottom: '100%'
  },
  card: {
    display: 'inline-block',
    margin: cardMargin
  }
};

class AlbumCard extends PureComponent {
  constructor(props) {
    super(props);
    this.domRef = React.createRef();
    this.state = {
      hasLoaded: false
    };
  }

  componentDidMount() {
    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(({ isIntersecting }) => {
          if (isIntersecting) {
            this.setState({ hasLoaded: true });
            this.observer = this.observer.disconnect();
          }
        });
      },
      {
        rootMargin: '500px 0px'
      }
    );

    this.observer.observe(this.domRef.current);
  }

  render() {
    const { classes, album } = this.props;
    return (
      <Card
        onClick={() => MoodeCommand.clearPlayAll(album.tracks)}
        className={classes.card}
      >
        <CardActionArea>
          <RootRef rootRef={this.domRef}>
            <CardMedia
              className={classes.media}
              image={this.state.hasLoaded ? album.thumb_url : defaultImage}
              title={album.title}
            />
          </RootRef>
          <CardContent>
            <Typography variant="body1" noWrap>
              {album.title}
              <Typography variant="caption" noWrap>
                {album.artist}
              </Typography>
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }
}

AlbumCard.propTypes = {
  album: AlbumShape.isRequired,
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(AlbumCard);
