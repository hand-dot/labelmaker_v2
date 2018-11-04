import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Notifications from '@material-ui/icons/Notifications';
import Typography from '@material-ui/core/Typography';
import { TITLE, ACCOUNT_ID } from '../constants';
import logo from '../image/logo.png';

const styles = {
  grow: {
    flexGrow: 1,
  },
};

class Header extends Component {
  componentDidMount() {
    if (window.twttr) {
      window.twttr.widgets.load(this.twFollowButton);
    }
  }

  render() {
    const { classes, theme } = this.props;
    return (
      <AppBar position="fixed" style={{ background: '#24292e' }}>
        <Toolbar>
          <img src={logo} width={30} height={30} style={{ marginRight: theme.spacing.unit }} alt="logo" />
          <Typography variant="title" color="inherit" className={classes.grow}>
            {TITLE}
          </Typography>
          <a
            ref={(twFollowButton) => { this.twFollowButton = twFollowButton; }}
            href={`https://twitter.com/${ACCOUNT_ID}?ref_src=twsrc%5Etfw`}
            className="twitter-follow-button"
            data-show-count="false"
          >
            {`Follow @${ACCOUNT_ID}`}
          </a>
          <IconButton color="inherit">
            <Notifications fontSize="small" />
            <span style={{ position: 'absolute', left: 15, top: 15 }} id="changelog" />
          </IconButton>
        </Toolbar>
      </AppBar>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line
  theme: PropTypes.object.isRequired, // eslint-disable-line
};

export default withStyles(styles, { withTheme: true })(Header);
