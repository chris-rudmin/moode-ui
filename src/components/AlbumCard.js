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
    height: 200,
    width: 200,
  },  
  card: {
    height: 268,
    width: 200,
    marginBottom: 8,
    marginRight: 8,
    display: 'inline-block',
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
