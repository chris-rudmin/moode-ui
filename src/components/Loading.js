import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = {
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
};

class Loading extends PureComponent {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.loading}>
        <Typography variant="h5" gutterBottom>
          Loading Library
        </Typography>
        <CircularProgress variant="indeterminate" size={80} />
      </div>
    );
  }
}

Loading.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(Loading);
