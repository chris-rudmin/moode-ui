import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { AlbumShape } from '../config/AppConstants';

const styles = {
  media: {
    height: 165,
  },
  card: {
    flexGrow: 1,
    width: 165,
    marginBottom: 8,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
};


class AlbumCard extends PureComponent {
  render() {
    const { classes, album } = this.props;
    return (
      <Card className={classes.card}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={album.thumb_url}
            title={album.title}
          />
          <CardContent>
            <Typography variant="body1" noWrap={true}>
              {album.title}
              <Typography variant="caption" noWrap={true}>
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
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(AlbumCard);
