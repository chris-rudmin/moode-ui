import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  appBar: {
    borderBottom: '1px solid'
  },
  toolbar: {
    flexWrap: 'wrap'
  },
  toolbarTitle: {
    flexGrow: 1
  }
};

class Header extends PureComponent {
  render() {
    const { classes } = this.props;
    return (
      <AppBar position="static">
        <Toolbar />
      </AppBar>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(Header);
