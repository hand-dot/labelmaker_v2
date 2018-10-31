import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Header from '../components/Header';
import TemplateEditor from '../components/TemplateEditor';
import LabelEditor from '../components/LabelEditor';

const styles = {};
class App extends Component {
  constructor(props) {
    super(props);
    this.hotInstance = null;
    this.state = {
      isTemplateEditor: false, // テンプレート開発者用。公開していません。
    };
  }

  render() {
    const { theme } = this.props;
    const { isTemplateEditor } = this.state;
    return (
      <>
        <Header />
        <div style={{ height: theme.mixins.toolbar.minHeight }} />
        {isTemplateEditor && <TemplateEditor />}
        {!isTemplateEditor && <LabelEditor />}
      </>
    );
  }
}

App.propTypes = {
  theme: PropTypes.object.isRequired, // eslint-disable-line
};

export default withStyles(styles, { withTheme: true })(App);
