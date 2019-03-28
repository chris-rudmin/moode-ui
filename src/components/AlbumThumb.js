import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import { AlbumShape } from '../config/AppConstants';

class AlbumThumb extends PureComponent {
  render() {
    return (
      <Card>
        <img src={this.props.imgUrl}/>
        <h2>{this.props.title}</h2>
        <p>{this.props.artist}</p>
      </Card>
    );
  }
}

AlbumThumb.propTypes = {
  album: AlbumShape.isRequired,
};

export default AlbumThumb;
