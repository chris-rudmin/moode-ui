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
    width: 165,
    marginBottom: 8,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  placeholder: {
    width: 165,
    height: 233,
    marginBottom: 8,
    backgroundColor: '#f2f5f2',
  }
};


class AlbumCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasLoaded: false,
    };
  }

  componentDidMount() {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(({ isIntersecting }) => {
        if (isIntersecting) {
          this.setState({ hasLoaded: true });
          this.observer = this.observer.disconnect();
        }
      });
    }, {
      rootMargin: "250%",
    });

    this.observer.observe(this.refs.placeHolder);
  }

  render() {
    const { classes, album } = this.props;

    if (this.state.hasLoaded) {
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
      )
    }

    return <div className={classes.placeholder} ref='placeHolder'></div>
  }
}

AlbumCard.propTypes = {
  album: AlbumShape.isRequired,
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(AlbumCard);
