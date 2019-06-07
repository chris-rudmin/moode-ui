import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { AlbumShape, cardMargin } from '../config/AppConstants';
import MoodeCommand from '../services/MoodeCommand';

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
  render() {
    const { classes, album } = this.props;
    return (
      <Card
        onClick={() => MoodeCommand.clearPlayAll(album.tracks)}
        className={classes.card}
      >
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={album.thumb_url}
            title={album.title}
          />
          <CardContent>
            <Typography variant="body1" noWrap>
              {album.title}
            </Typography>
            <Typography variant="caption" display="block" noWrap>
              {album.artist}
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
