import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Notifications from '@material-ui/icons/Notifications';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import Typography from '@material-ui/core/Typography';

const styles = {
  white: {
    color: '#fff',
  },
  grow: {
    flexGrow: 1,
  },
};


function Header(props) {
  const {
    template, templates, handleChangeTemplate, classes,
  } = props;
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" color="inherit" className={classes.grow}>
        レターパックラベルを一括作成！
        </Typography>
        <FormControl>
          <InputLabel classes={{ root: classes.white }} htmlFor="select-template-helper">テンプレート</InputLabel>
          <NativeSelect
            classes={{ root: classes.white }}
            value={template}
            onChange={handleChangeTemplate}
            input={<Input name="age" id="select-template-helper" />}
          >
            {templates.map(_ => (<option key={_} value={_}>{_}</option>))}
          </NativeSelect>
        </FormControl>
        <IconButton color="inherit">
          <Notifications />
          <span style={{ position: 'absolute', left: 15, top: 15 }} id="changelog" />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  template: PropTypes.string.isRequired,
  templates: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  handleChangeTemplate: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired, // eslint-disable-line
  theme: PropTypes.object.isRequired, // eslint-disable-line
};

export default withStyles(styles, { withTheme: true })(Header);
