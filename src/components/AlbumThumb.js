import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AlbumShape } from '../config/AppConstants';
import Card from '@material-ui/core/Card';

class AlbumThumb extends Component {
  render() {
    return (
      <Card>
        {this.props.album.album}
        {this.props.album.artist}
      </Card>
    );
  }
}

AlbumThumb.propTypes = {
  album: AlbumShape.isRequired
};

export default AlbumThumb;