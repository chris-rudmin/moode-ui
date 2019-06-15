import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AlbumGrid from './AlbumGrid';
import Header from './Header';
import Player from './Player';

const styles = {
  layout: {
    display: 'flex',
    flexFlow: 'column',
    height: '100%',
  },
};

class Layout extends PureComponent {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.layout}>
        <Header />
        <AlbumGrid />
        <Player />
      </div>
    );
  }
}

Layout.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(Layout);
