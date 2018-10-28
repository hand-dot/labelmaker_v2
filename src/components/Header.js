import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Notifications from '@material-ui/icons/Notifications';
import Typography from '@material-ui/core/Typography';

const styles = {
  grow: {
    flexGrow: 1,
  },
};

function Header(props) {
  const { classes } = props;
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" color="inherit" className={classes.grow}>
        レターパックラベルを一括作成！
        </Typography>
        <IconButton color="inherit">
          <Notifications />
          <span style={{ position: 'absolute', left: 15, top: 15 }} id="changelog" />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line
  theme: PropTypes.object.isRequired, // eslint-disable-line
};

export default withStyles(styles, { withTheme: true })(Header);
